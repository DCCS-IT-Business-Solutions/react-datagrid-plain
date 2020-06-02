import * as React from "react";
import { SortDirection, ChangeFilterHandler } from "@dccs/react-table-plain";
import { OnLoadData } from ".";

export interface IDataGridState {
  total: number;
  setTotal: (total: number) => void;
  page: number;
  setPage: (page: number) => void;
  rowsPerPage: number;
  setRowsPerPage: (rpp: number) => void;
  orderBy: string | undefined;
  setOrderBy: (orderBy: string) => void;
  sort: SortDirection | undefined;
  setSort: (sort: SortDirection | undefined) => void;
  filter:
    | {
        [key: string]: any;
      }
    | undefined;
  setFilter: (filter: { [key: string]: any } | undefined) => void;
  allowLoad: boolean;
  setAllowLoad: React.Dispatch<React.SetStateAction<boolean>>;
  error: boolean;
  loading: boolean;
  data: any[];
  reload: () => void;
  handleChangePage(p: number): void;
  handleChangeRowsPerPage(rows: number): void;
  handleChangeOrderBy(ob: string): void;
  handleChangeFilter(ob: string, value: any): void;
  load(): void;
  // Vorerst noch nicht von außen änderbar
  // setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // setError: React.Dispatch<React.SetStateAction<boolean>>;
  // setData: React.Dispatch<React.SetStateAction<any[]>>;
}

export interface IPersistState {
  store: "localStorage" | "sessionStorage";
  uniqueID: string;
}

export interface IUseDataGridProps {
  onLoadData: OnLoadData;
  initialRowsPerPage?: number;
  initialOrderBy?: string;
  initialSort?: SortDirection;
  initialLoad?: boolean;
  onChangeFilter?: ChangeFilterHandler;
  persistState?: IPersistState;
}

const getStateFromStore = (props?: IUseDataGridProps) => {
  if (props && props.persistState && props.persistState.uniqueID) {
    if (props.persistState.store === "localStorage") {
      const state = localStorage.getItem(props.persistState.uniqueID);

      if (state) {
        return JSON.parse(state) as IDataGridState;
      }
    } else if (props.persistState.store === "sessionStorage") {
      const state = sessionStorage.getItem(props.persistState.uniqueID);

      if (state) {
        return JSON.parse(state) as IDataGridState;
      }
    }
  }

  return undefined;
};

export function useDataState(props: IUseDataGridProps) {
  const stateFromStore = getStateFromStore(props);

  const [rowsPerPage, setRowsPerPage] = React.useState(
    (stateFromStore && stateFromStore.rowsPerPage) ||
      (props && props.initialRowsPerPage) ||
      10
  );
  const [page, setPage] = React.useState(
    (stateFromStore && stateFromStore.page) || 0
  );
  const [total, setTotal] = React.useState(
    (stateFromStore && stateFromStore.total) || 0
  );
  const [orderBy, setOrderBy] = React.useState(
    (stateFromStore && stateFromStore.orderBy) ||
      (props && props.initialOrderBy)
  );
  const [sort, setSort] = React.useState<SortDirection | undefined>(
    (stateFromStore && stateFromStore.sort) || undefined
  );
  const [filter, setFilter] = React.useState<
    { [key: string]: any } | undefined
  >((stateFromStore && stateFromStore.filter) || undefined);

  // Always use initial here? not sure
  const [allowLoad, setAllowLoad] = React.useState(
    props && props.initialLoad === false ? false : true
  );

  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [reloadDummy, setReload] = React.useState(false);

  const reload = () => {
    setReload(!reloadDummy);
  };

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
    reloadDummy,
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

  const state: IDataGridState = {
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
    filter,
    setFilter,
    allowLoad,
    setAllowLoad,
    data,
    loading,
    error,
    reload,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChangeOrderBy,
    handleChangeFilter,
    load,
  };

  React.useEffect(() => {
    if (props && props.persistState && props.persistState.uniqueID) {
      if (props.persistState.store === "localStorage") {
        localStorage.setItem(
          props.persistState.uniqueID,
          JSON.stringify(state)
        );
      } else if (props.persistState.store === "sessionStorage") {
        sessionStorage.setItem(
          props.persistState.uniqueID,
          JSON.stringify(state)
        );
      }
    }
  }, [state]);

  return state;
}
