import * as React from "react";
import {
  TablePlain,
  IColDef,
  ITablePlainProps as ITableProps,
  SortDirection,
  // ChangeFilterHandler,
} from "@dccs/react-table-plain";
import { IState } from "./IState";
import {
  useDataGridState,
  IDataGridState,
  IUseDataGridProps,
} from "./useDataGridState";

export type OnLoadData = (
  page: number,
  rowsPerPage: number,
  orderBy: string | undefined,
  sort: SortDirection | undefined,
  filter: { [key: string]: any } | undefined
) => Promise<{ total: number; data: any[] }>;

export interface IRenderPagingProps extends IState {
  backIconButtonText?: string;
  nextIconButtonText?: string;
  labelRowsPerPage?: string;
  // Example labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
  labelDisplayedRows?: ({
    count,
    from,
    to,
  }: {
    count?: number;
    from?: number;
    to?: number;
  }) => string;
  handleChangePage: (page: number) => void;
  handleChangeRowsPerPage: (rows: number) => void;
}
export interface IDataGridTexts {
  errorText?: string;
  loadingText?: string;
  pagingText?: string;
  reloadText?: string;
  backIconButtonText?: string;
  nextIconButtonText?: string;
  labelRowsPerPage?: string;
  labelDisplayedRows?: ({
    count,
    from,
    to,
  }: {
    count?: number;
    from?: number;
    to?: number;
  }) => string;
}

export interface IDataGridWithExternalStateProps extends IDataGridProps {
  state?: IDataGridState;
}

export interface IDataGridWithInternalStateProps
  extends IDataGridProps,
    IUseDataGridProps {}

export interface IDataGridProps {
  texts?: IDataGridTexts;
  colDef: IColDef[];
  onLoadData: OnLoadData;
  disablePaging?: boolean;
  tableTheme?: any;
  onRowClick?: (data: any) => void;
  subComponent?: (data: any) => React.ReactNode;
  renderTable?: (ps: ITableProps) => React.ReactElement;
  renderLoading?: () => React.ReactElement;
  renderError?: (
    load: () => void,
    errorText?: string,
    reloadText?: string
  ) => React.ReactElement;
  renderPaging?: (props: IRenderPagingProps) => React.ReactElement;
  renderHeaderCell?: (col: IColDef, idx: number) => React.ReactNode;
  renderFooterCell?: (
    col: IColDef,
    data: any[],
    idx: number
  ) => React.ReactNode;
  renderFilter?: (col: IColDef, idx: number) => React.ReactNode;
  renderExpansionIndicator?: (expanded: boolean) => React.ReactNode;
  rowProps?: (data: any) => object;
  cellProps?: (data: any) => object;
  ellipsis?: boolean;
  selectedRow?: any | any[];
  onChangeSelectedRow?: (data: any) => void;
  selectedRowProps?: (data: any) => object;
  rowSelectionColumnName?: string;
  filter?: object;
}

export function DataGridPlain(
  props: IDataGridWithExternalStateProps | IDataGridWithInternalStateProps
) {
  debugger;
  const internalState = useDataGridState();

  const {
    rowsPerPage,
    setRowsPerPage,
    page,
    setPage,
    total,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    filter,
    setFilter,
    data,
    loading,
    error,
    allowLoad,
    setAllowLoad,
    setData,
    setError,
    setLoading,
    setTotal,
    reload,
  } = (props as IDataGridWithExternalStateProps).state || internalState;

  React.useEffect(() => {
    if (allowLoad === true) {
      load();
    } else {
      // allowLoad on second try.
      setAllowLoad(true);
    }
  }, [
    rowsPerPage,
    page,
    orderBy,
    sort === "desc",
    reload,
    // Why JSON.stringify?
    // The way the useEffect dependency array works is by checking for strict (===) equivalency between all of the items in the array from the previous render and the new render.
    // Example:  {}==={}                                   -> false -> different -> rerender
    // Example2: JSON.stringify({}) === JSON.stringify({}) -> true  -> same      -> no rerender
    JSON.stringify(filter),
  ]);

  function load() {
    setLoading(true);
    setError(false);

    props
      .onLoadData(page + 1, rowsPerPage, orderBy, sort, filter)
      .then(({ data: d, total: t }) => {
        setTotal(t);
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }

  function handleChangePage(p: number) {
    setPage(p);
  }

  function handleChangeRowsPerPage(rows: number) {
    setRowsPerPage(rows);
  }

  function handleChangeOrderBy(ob: string) {
    let s: SortDirection | undefined;

    if (orderBy && orderBy === ob) {
      s = sort === "desc" ? "asc" : "desc";
    }

    setOrderBy(ob);
    setSort(s);
  }

  function handleChangeFilter(ob: string, value: any) {
    //TODO: IsOnChangeFilter still needed?
    // if (props.onChangeFilter) {
    //   props.onChangeFilter(ob, value);
    // } else {
    setFilter({ ...filter, [ob]: value });
    // }
  }

  function renderTable() {
    const ps = {
      data,
      colDef: props.colDef,
      orderBy: orderBy,
      sort: sort,
      filter: filter,
      onChangeOrderBy: handleChangeOrderBy,
      onChangeFilter: handleChangeFilter,
      onRowClick: props.onRowClick,
      subComponent: props.subComponent,
      selectedRow: props.selectedRow,
      selectedRowProps: props.selectedRowProps,
      onChangeSelectedRow: props.onChangeSelectedRow,
      rowSelectionColumnName: props.rowSelectionColumnName,
    };
    if (props.renderTable != null) {
      return props.renderTable(ps);
    }
    return <TablePlain {...ps} />;
  }

  function renderLoading() {
    if (props.renderLoading != null) {
      return props.renderLoading();
    }

    let loadingText = "Loading...";
    if (props.texts && props.texts.loadingText != null) {
      loadingText = props.texts.loadingText;
    }

    return <h5>{loadingText}</h5>;
  }

  function renderError() {
    let errorText = "Die Daten konnten nicht geladen werden.";
    if (props.texts && props.texts.errorText != null) {
      errorText = props.texts.errorText;
    }

    let reloadText = "Neu laden";
    if (props.texts && props.texts.reloadText != null) {
      reloadText = props.texts.reloadText;
    }

    if (props.renderError != null) {
      return props.renderError(load, errorText, reloadText);
    }
    return (
      <p style={{ width: "100%", background: "red", padding: 16 }}>
        <p>{errorText}</p>
        <p>
          <button onClick={() => load()}>{reloadText}</button>
        </p>
      </p>
    );
  }

  function renderPaging() {
    if (props.renderPaging != null) {
      const labelRowsPerPage = props.texts && props.texts.labelRowsPerPage;
      const backIconButtonText = props.texts && props.texts.backIconButtonText;
      const nextIconButtonText = props.texts && props.texts.nextIconButtonText;
      const labelDisplayedRows = props.texts && props.texts.labelDisplayedRows;

      return props.renderPaging({
        rowsPerPage,
        page,
        total,
        orderBy,
        sort,
        filter,
        labelRowsPerPage: labelRowsPerPage,
        backIconButtonText: backIconButtonText,
        nextIconButtonText: nextIconButtonText,
        labelDisplayedRows: labelDisplayedRows,
        handleChangePage,
        handleChangeRowsPerPage,
      });
    }
    let pagingText = "No paging available right now. Check back later...";
    if (props.texts && props.texts.pagingText != null) {
      pagingText = props.texts.pagingText;
    }

    return <strong>{pagingText}</strong>;
  }

  if (error) {
    return renderError();
  }

  return (
    <div style={{ position: "relative", overflowX: "auto", width: "100%" }}>
      {loading && renderLoading()}

      {renderTable()}

      {props.disablePaging !== true && renderPaging()}
    </div>
  );
}
