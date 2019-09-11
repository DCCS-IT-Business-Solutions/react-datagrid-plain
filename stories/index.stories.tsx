import * as React from "react";

import { storiesOf } from "@storybook/react";

import { DataGridPlain } from "../src/DataGridPlain";
import { TablePlain } from "@dccs/react-table-plain";
import { tableMuiTheme } from "@dccs/react-table-mui";
import { tableSemanticUITheme } from "@dccs/react-table-semantic-ui";
import { TablePagination } from "@material-ui/core";

const sampleData1 = [
  { name: "A", number: 1 },
  { name: "B", number: 2 },
  { name: "C", number: 3 },
  { name: "D", number: 4 },
  { name: "E", number: 5 },
  { name: "F", number: 6 },
  { name: "G", number: 7 },
  { name: "H", number: 8 },
  { name: "I", number: 9 },
  { name: "J", number: 10 },
  { name: "K", number: 11 },
  { name: "L", number: 12 }
];

const demoColDefs = [
  { prop: "name", header: "Name", sortable: true },
  { prop: "number", header: "Zahl" }
];

storiesOf("DataGridPlain", module)
  .add("simple", () => (
    <DataGridPlain
      colDef={demoColDefs}
      onLoadData={() =>
        new Promise(res =>
          res({ total: sampleData1.length, data: sampleData1 })
        )
      }
    />
  ))
  .add("initialOrderBy", () => (
    <DataGridPlain
      initialOrderBy="name"
      colDef={demoColDefs}
      onLoadData={(x, y, orderBy) => {
        return new Promise(res =>
          res({ total: sampleData1.length, data: sampleData1 })
        );
      }}
    />
  ));

storiesOf("DataGridMui", module).add("simple", () => (
  <DataGridPlain
    colDef={demoColDefs}
    onLoadData={() =>
      new Promise(res => res({ total: sampleData1.length, data: sampleData1 }))
    }
    renderTable={ps => <TablePlain {...tableMuiTheme} {...ps} />}
    renderPaging={({
      total,
      rowsPerPage,
      page,
      handleChangePage,
      handleChangeRowsPerPage
    }) => (
      <TablePagination
        component={ps => <div {...ps}>{ps.children}</div>}
        colSpan={demoColDefs != null ? demoColDefs.length : 1}
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={(e, p) => handleChangePage(p)}
        onChangeRowsPerPage={e =>
          handleChangeRowsPerPage(parseInt(e.target.value, 10))
        }
        labelRowsPerPage={"Einträge pro Seite:"}
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} von ${count}`
        }
      />
    )}
  />
));

storiesOf("DataGridSemanticUI", module).add("simple", () => (
  <DataGridPlain
    colDef={[
      { prop: "name", header: "Name" },
      { prop: "number", header: "Zahl" }
    ]}
    onLoadData={() =>
      new Promise(res => res({ total: sampleData1.length, data: sampleData1 }))
    }
    renderTable={ps => <TablePlain {...tableSemanticUITheme} {...ps} />}
    renderPaging={() => <small>Kein Paging in Semantic-UI momentan.</small>}
  />
));
