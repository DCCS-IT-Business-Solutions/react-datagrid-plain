import * as React from "react";
import { IState } from "./IState";
import { SortDirection } from "@dccs/react-table-plain";
import { useDataGridState } from "./useDataGridState";

export interface IDataGridStateContext extends IState {
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
  forceReload: () => void;
  reload: boolean;
}

export const DataGridState = React.createContext<
  IDataGridStateContext | undefined
>(undefined);

interface IDataGripStateProviderProps {
  initialOrderBy?: string;
  initialSort?: "asc" | "desc";
  initialRowsPerPage?: number;
  onChangeFilter?: any;
  initialLoad: boolean;
}

export const DataGridStateProvider: React.FC<IDataGripStateProviderProps> = (
  props
) => {
  const state = useDataGridState({
    initialLoad: props.initialLoad,
    initialOrderBy: props.initialOrderBy,
    initialRowsPerPage: props.initialRowsPerPage,
    initialSort: props.initialSort,
    onChangeFilter: props.onChangeFilter,
  });

  return (
    <DataGridState.Provider value={state}>
      {props.children}
    </DataGridState.Provider>
  );
};
