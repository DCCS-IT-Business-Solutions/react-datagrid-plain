import { IColDef } from "@dccs/react-table-plain";

export interface IState {
  rowsPerPage: number;
  page: number;
  total: number;
  orderBy?: IColDef;
  desc: boolean;
  filter: any;
  reloadDummy: boolean;
}
