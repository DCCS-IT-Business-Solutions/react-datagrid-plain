import { SortDirection, ChangeFilterHandler } from "@dccs/react-table-plain";
import { DataGridState } from ".";
import React = require("react");

export interface IUseDataGridProps {
  initialRowsPerPage?: number;
  initialOrderBy?: string;
  initialSort?: SortDirection;
  initialLoad?: boolean;
  onChangeFilter?: ChangeFilterHandler;
}

function useInternalState(props: IUseDataGridProps) {
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
  const [allowLoad, setAllowLoad] = React.useState(
    props.initialLoad ? true : false
  );
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [reload, setReload] = React.useState(false);

  const forceReload = () => {
    setReload(!reload);
  };

  return {
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
    reload,
    forceReload,
  };
}

export function useDataGridState(props: IUseDataGridProps) {
  // Do we have a custom context,
  // TODO does this comply with rules of hooks?
  const state = React.useContext(DataGridState) || useInternalState(props);

  return state;
}
