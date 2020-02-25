import * as React from "react";
import {
  TablePlain,
  IColDef,
  ITablePlainProps as ITableProps,
  SortDirection,
  ChangeFilterHandler
} from "@dccs/react-table-plain";
import { IState } from "./IState";
import { DataGridState } from "./DataGridStateContext";

export type OnLoadData = (
  page: number,
  rowsPerPage: number,
  orderBy: string | undefined,
  sort: SortDirection | undefined,
  filter: { [key: string]: any } | undefined
) => Promise<{ total: number; data: any[] }>;

export interface IRenderPagingProps extends IState {
  handleChangePage: (page: number) => void;
  handleChangeRowsPerPage: (rows: number) => void;
}

export interface IDataGridProps {
  colDef: IColDef[];
  initialRowsPerPage?: number;
  initialOrderBy?: string;
  initialSort?: SortDirection;
  onLoadData: OnLoadData;
  disablePaging?: boolean;
  tableTheme?: any;
  onRowClick?: (data: any) => void;
  subComponent?: (data: any) => React.ReactNode;

  renderTable?: (ps: ITableProps) => React.ReactElement;
  renderLoading?: () => React.ReactElement;
  renderError?: (load: () => void) => React.ReactElement;
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
  onChangeFilter?: ChangeFilterHandler;
  filter?: object;
}

export function DataGridPlain(props: IDataGridProps) {
  // Internal state...if there is no DataGridStateProvider.
  const [rowsPerPage, setRowsPerPage] = React.useState(
    props.initialRowsPerPage || 10
  );
  const [page, setPage] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(props.initialOrderBy);
  const [sort, setSort] = React.useState<SortDirection | undefined>();
  const [filter, setFilter] = React.useState<
    { [key: string]: any } | undefined
  >();

  // Do we have a custom context,...
  const state = React.useContext(DataGridState) || {
    rowsPerPage,
    setRowsPerPage,
    page,
    setPage,
    total,
    setTotal,
    orderBy,
    setOrderBy,
    sort,
    setSort,
    filter: props.filter || filter,
    setFilter,
    reloadDummy: false,
    reload: () => {
      throw new Error(
        "No supported in DateGridPlain, only in DataGridStateProvider."
      );
    }
  };

  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    console.log("useEffect");
    console.log(state.filter);

    setLoading(true);
    setError(false);

    props
      .onLoadData(
        state.page + 1,
        state.rowsPerPage,
        state.orderBy,
        state.sort,
        state.filter
      )
      .then(({ data: d, total: t }) => {
        state.setTotal(t);
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }, [
    state.rowsPerPage,
    state.page,
    state.orderBy,
    state.sort === "desc",
    state.reloadDummy,
    // Why json.stringigy?
    // The way the useEffect dependency array works is by checking for strict (===) equivalency between all of the items in the array from the previous render and the new render.
    // Example:  {}==={}                                   -> false -> different -> rerender
    // Example2: JSON.stringify({}) === JSON.stringify({}) -> true  -> same      -> no rerender
    JSON.stringify(state.filter),
    JSON.stringify(props)
  ]);

  function load() {
    setLoading(true);
    setError(false);

    props
      .onLoadData(
        state.page + 1,
        state.rowsPerPage,
        state.orderBy,
        state.sort,
        state.filter
      )
      .then(({ data: d, total: t }) => {
        state.setTotal(t);
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }

  function handleChangePage(p: number) {
    state.setPage(p);
  }

  function handleChangeRowsPerPage(rows: number) {
    state.setRowsPerPage(rows);
  }

  function handleChangeOrderBy(ob: string) {
    let s: SortDirection | undefined;

    if (state.orderBy && state.orderBy === ob) {
      s = state.sort === "desc" ? "asc" : "desc";
    }

    state.setOrderBy(ob);
    state.setSort(s);
  }

  function handleChangeFilter(ob: string, value: any) {
    if (props.onChangeFilter) {
      props.onChangeFilter(ob, value);
    } else {
      state.setFilter({ ...state.filter, [ob]: value });
    }
  }

  function renderTable() {
    const ps = {
      data,
      colDef: props.colDef,
      orderBy: state.orderBy,
      sort: state.sort,
      filter: state.filter,
      onChangeOrderBy: handleChangeOrderBy,
      onChangeFilter: handleChangeFilter,
      onRowClick: props.onRowClick,
      subComponent: props.subComponent,
      selectedRow: props.selectedRow,
      selectedRowProps: props.selectedRowProps,
      onChangeSelectedRow: props.onChangeSelectedRow,
      rowSelectionColumnName: props.rowSelectionColumnName
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
    return <h5>Loading...</h5>;
  }

  function renderError() {
    if (props.renderError != null) {
      return props.renderError(load);
    }
    return (
      <p style={{ width: "100%", background: "red", padding: 16 }}>
        <p>Die Daten konnten nicht geladen werden.</p>
        <p>
          <button onClick={() => load()}>Neu laden</button>
        </p>
      </p>
    );
  }

  function renderPaging() {
    if (props.renderPaging != null) {
      return props.renderPaging({
        ...state,
        handleChangePage,
        handleChangeRowsPerPage
      });
    }
    return <strong>No paging available right now. Check back later...</strong>;
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
