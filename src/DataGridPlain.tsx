import * as React from "react";
import {
  TablePlain,
  IColDef,
  ITablePlainProps as ITableProps,
  SortDirection,
} from "@dccs/react-table-plain";
import { IState } from "./IState";
import { IDataState, IUseDataStateProps, useDataState } from "./useDataState";

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
  state?: IDataState;
}

export interface IDataGridWithInternalStateProps
  extends IDataGridProps,
    IUseDataStateProps {}

export interface IDataGridProps {
  texts?: IDataGridTexts;
  colDef: IColDef[];
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
}

export function DataGridPlain(
  props: IDataGridWithInternalStateProps | IDataGridWithExternalStateProps
) {
  const internalState = useDataState(props as IDataGridWithInternalStateProps);

  const {
    rowsPerPage,
    page,
    total,
    orderBy,
    sort,
    filter,
    data,
    loading,
    error,
    handleChangeOrderBy,
    handleChangeFilter,
    handleChangeRowsPerPage,
    handleChangePage,
    load,
  } = (props as IDataGridWithExternalStateProps).state || internalState;

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
