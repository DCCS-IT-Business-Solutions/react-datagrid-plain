import * as React from "react";
import { storiesOf } from "@storybook/react";
import { DataGridPlain } from "../src/DataGridPlain";
import { TablePlain } from "@dccs/react-table-plain";
import { tableMuiTheme } from "@dccs/react-table-mui";
import { tableSemanticUITheme } from "@dccs/react-table-semantic-ui";
import { TablePagination } from "@material-ui/core";
import { useDataState } from "../src/useDataState";

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
  { name: "L", number: 12 },
];

const demoColDefs = [
  { prop: "name", header: "Name", sortable: true },
  { prop: "number", header: "Zahl" },
];

function SimpleExample() {
  return (
    <DataGridPlain
      colDef={demoColDefs}
      initialLoad={true}
      onLoadData={() =>
        new Promise((res) =>
          res({ total: sampleData1.length, data: sampleData1 })
        )
      }
    />
  );
}

function SelectedRowExample() {
  const [selectedRow, setSelectedRow] = React.useState();

  const handleEditMode = (data: any) => {
    setSelectedRow(data);
  };

  function selectedRowProps(data: any) {
    return { style: { background: "yellow" } };
  }

  return (
    <DataGridPlain
      selectedRow={selectedRow}
      selectedRowProps={selectedRowProps}
      onChangeSelectedRow={handleEditMode}
      colDef={demoColDefs}
      onLoadData={() => {
        return new Promise((res) =>
          res({ total: sampleData1.length, data: sampleData1 })
        );
      }}
    />
  );
}

function ExternalStateExample() {
  const datagridState = useDataState({
    onLoadData: () => {
      return new Promise((res) =>
        setTimeout(() => {
          return res({ total: sampleData1.length, data: sampleData1 });
        }, 3000)
      );
    },
  });

  return (
    <React.Fragment>
      <DataGridPlain state={datagridState} colDef={demoColDefs} />

      <button onClick={() => datagridState.reload()}>Reload</button>
    </React.Fragment>
  );
}

function ExternalStateLocalStorageExample() {
  const datagridState = useDataState({
    persistState: {
      store: "localStorage",
      uniqueID: "ExternalStateLocalStorageExample",
    },
    onLoadData: () => {
      return new Promise((res) =>
        setTimeout(() => {
          return res({ total: sampleData1.length, data: sampleData1 });
        }, 3000)
      );
    },
  });

  return (
    <React.Fragment>
      <DataGridPlain state={datagridState} colDef={demoColDefs} />

      <button onClick={() => datagridState.reload()}>Reload</button>
    </React.Fragment>
  );
}

storiesOf("DataGridPlain", module)
  .add("simple", () => <SimpleExample />)
  .add("initialOrderBy", () => (
    <DataGridPlain
      initialOrderBy="name"
      initialSort="asc"
      initialRowsPerPage={100}
      colDef={demoColDefs}
      onLoadData={(page, rowsPerPage, orderBy, sort, filter) => {
        console.log(
          "OnloadData Props",
          filter,
          rowsPerPage,
          page,
          orderBy,
          sort
        );

        return new Promise((res) =>
          res({ total: sampleData1.length, data: sampleData1 })
        );
      }}
    />
  ))
  .add("selectedRow", () => <SelectedRowExample />)
  .add("externalState", () => <ExternalStateExample />)
  .add("externalStateLocalStorage", () => <ExternalStateLocalStorageExample />);

storiesOf("DataGridMui", module).add("simple", () => (
  <DataGridPlain
    colDef={demoColDefs}
    onLoadData={() =>
      new Promise((res) =>
        res({ total: sampleData1.length, data: sampleData1 })
      )
    }
    renderTable={(ps) => <TablePlain {...tableMuiTheme} {...ps} />}
    renderPaging={({
      total,
      rowsPerPage,
      page,
      handleChangePage,
      handleChangeRowsPerPage,
    }) => (
      <TablePagination
        component={(ps) => <div {...ps}>{ps.children}</div>}
        colSpan={demoColDefs != null ? demoColDefs.length : 1}
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={(e, p) => handleChangePage(p)}
        onChangeRowsPerPage={(e) =>
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
      { prop: "number", header: "Zahl" },
    ]}
    onLoadData={() =>
      new Promise((res) =>
        res({ total: sampleData1.length, data: sampleData1 })
      )
    }
    renderTable={(ps) => <TablePlain {...tableSemanticUITheme} {...ps} />}
    renderPaging={() => <small>Kein Paging in Semantic-UI momentan.</small>}
  />
));
