import * as React from "react";
import { SortDirection, ChangeFilterHandler } from "@dccs/react-table-plain";

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
  setError: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  reload: () => void;
  reloadDummy: boolean;
}

export interface IPersistState {
  store: "localStorage" | "sessionStorage";
  uniqueID: string;
}

export interface IUseDataGridProps {
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

export function useDataGridState(props?: IUseDataGridProps) {
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
    setData,
    loading,
    setLoading,
    error,
    setError,
    reloadDummy: reloadDummy,
    reload,
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
