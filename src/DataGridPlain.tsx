import * as React from "react";
import {
  TablePlain,
  IColDef,
  IProps as ITableProps
} from "@dccs/react-table-plain";
import { IState } from "./IState";
import { DataGridState, reducer, IAction } from "./DataGridStateContext";

export type OnLoadData = (
  page: number,
  rowsPerPage: number,
  orderBy: string,
  desc: boolean,
  filter: { [key: string]: any }
) => Promise<{ total: number; data: any[] }>;

export interface IRenderPagingProps extends IState {
  handleChangePage: (page: number) => void;
  handleChangeRowsPerPage: (rows: number) => void;
}

export interface IDataGridProps {
  colDef: IColDef[];
  initalRowsPerPage?: number;
  initalOrderBy?: string;
  onLoadData: OnLoadData;
  disablePaging?: boolean;
  tableTheme?: any;
  onRowClick?: (data: any) => void;
  subComponent?: (data: any) => React.ReactNode;

  renderTable?: (ps: ITableProps) => React.ReactElement;
  renderLoading?: () => React.ReactElement;
  renderError?: (load: () => void) => React.ReactElement;
  renderPaging?: (props: IRenderPagingProps) => React.ReactElement;
}

export function DataGridPlain(props: IDataGridProps) {
  // Do we have a custom context,...
  let stateContext = React.useContext(DataGridState);
  const privateReducer = React.useReducer<React.Reducer<IState, IAction>>(
    reducer,
    {
      rowsPerPage: props.initalRowsPerPage || 10,
      page: 0,
      total: 0,
      orderBy: props.initalOrderBy
        ? props.colDef.find(c => c.props === props.initalOrderBy)
        : undefined,
      desc: false,
      filter: {},
      reloadDummy: false
    }
  ); // ...if not, we need to create the state.

  if (stateContext === undefined) {
    stateContext = { state: privateReducer[0], dispatch: privateReducer[1] };
  }

  const { state, dispatch } = stateContext!;
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setError(false);

    props
      .onLoadData(
        state.page + 1,
        state.rowsPerPage,
        state.orderBy ? (state.orderBy! as IColDef).prop : "",
        state.desc,
        state.filter
      )
      .then(({ data: d, total }) => {
        dispatch({ type: "set-total", payload: total });
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
    state.desc,
    state.filter,
    state.reloadDummy,
    props,
    dispatch
  ]);

  function load() {
    setLoading(true);
    setError(false);

    props
      .onLoadData(
        state.page + 1,
        state.rowsPerPage,
        state.orderBy ? (state.orderBy! as IColDef).prop : "",
        state.desc,
        state.filter
      )
      .then(({ data: d, total }) => {
        dispatch({ type: "set-total", payload: total });
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError(true);
      });
  }

  function handleChangePage(page: number) {
    dispatch({ type: "set-page", payload: page });
  }

  function handleChangeRowsPerPage(rows: number) {
    dispatch({ type: "set-rowsperpage", payload: rows });
  }

  function handleChangeOrderBy(colDef: IColDef) {
    let desc = false;

    if (state.orderBy && state.orderBy.prop === colDef.prop) {
      desc = !state.desc;
    }

    dispatch({ type: "set-orderBy", payload: { orderBy: colDef, desc } });
  }

  function handleChangeFilter(colDef: IColDef, value: any) {
    dispatch({ type: "set-filter", payload: { [colDef.prop]: value } });
  }

  function renderTable() {
    const ps = {
      data,
      colDef: props.colDef,
      orderedBy: state.orderBy,
      desc: state.desc,
      onChangeOrderBy: handleChangeOrderBy,
      onChangeFilter: handleChangeFilter,
      onRowClick: props.onRowClick,
      subComponent: props.subComponent
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
