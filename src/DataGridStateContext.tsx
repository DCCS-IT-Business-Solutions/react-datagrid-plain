import * as React from "react";
import { IState } from "./IState";
import { SortDirection } from "@dccs/react-table-plain";

export interface IDataGridStateContext extends IState {
  setTotal: (total: number) => void;
  setPage: (page: number) => void;
  setRowsPerPage: (rpp: number) => void;
  setOrderBy: (orderBy: string) => void;
  setSort: (sort: SortDirection | undefined) => void;
  setFilter: (filter: { [key: string]: any } | undefined) => void;
  reload: () => void;
}

export const DataGridState = React.createContext<
  IDataGridStateContext | undefined
>(undefined);

interface IDataGripStateProviderProps {
  children: React.ReactNode;
  initialOrderBy?: string;
  initialSort?: "asc" | "desc";
}

export function DataGridStateProvider(props: IDataGripStateProviderProps) {
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [orderBy, setOrderBy] = React.useState(props.initialOrderBy);
  const [sort, setSort] = React.useState<SortDirection | undefined>();
  const [filter, setFilter] = React.useState<
    { [key: string]: any } | undefined
  >();
  const [reloadDummy, setReloadDummy] = React.useState(false);

  return (
    <DataGridState.Provider
      value={{
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
        reload: () => setReloadDummy(!reloadDummy)
      }}
    >
      {props.children}
    </DataGridState.Provider>
  );
}
