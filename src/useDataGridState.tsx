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

export interface IUseDataGridProps {
  initialRowsPerPage?: number;
  initialOrderBy?: string;
  initialSort?: SortDirection;
  initialLoad?: boolean;
  onChangeFilter?: ChangeFilterHandler;
}

export function useDataGridState(props?: IUseDataGridProps) {
  debugger;
  const [rowsPerPage, setRowsPerPage] = React.useState(
    (props && props.initialRowsPerPage) || 10
  );
  const [page, setPage] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(props && props.initialOrderBy);
  const [sort, setSort] = React.useState<SortDirection | undefined>();
  const [filter, setFilter] = React.useState<
    { [key: string]: any } | undefined
  >();
  const [allowLoad, setAllowLoad] = React.useState(
    props && props.initialLoad ? true : false
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

  return state;
}
