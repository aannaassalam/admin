import React, { forwardRef, useImperativeHandle } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import { MenuItem, Select } from "@material-ui/core";
import { useExportData } from "react-table-plugins";
import XLSX from "xlsx";
// import SwipeToDelete from "react-swipe-to-delete-component";
import "./table.css";
// import chevron_left from "../../../assets/chevron-left.svg";
// import chevron_right from "../../../assets/chevron-right.svg";

const Table = forwardRef((props, ref) => {
  // Use the state and functions returned from useTable to build your UI

  // useImperativeHandle(ref, () => ({
  //   export() {
  //     exportData("xlsx", true);
  //   },
  // }));

  const { columns, data } = props;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    pageOptions,
    page,
    state: { pageIndex, pageSize },
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    // exportData,
  } = useTable(
    {
      columns,
      data,
      // getExportFileBlob,
    },
    useSortBy,
    usePagination
    // useExportData
  );

  const pageSizeOptions = [10, 20, 30, 40];

  function getExportFileBlob({ columns, data, fileType, fileName }) {
    console.log(columns);
    const header = columns.map((c) => c.exportValue);
    const compatibleData = data.map((row) => {
      const obj = {};
      header.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj;
    });

    let wb = XLSX.utils.book_new();
    let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
      header,
    });
    XLSX.utils.book_append_sheet(wb, ws1, "Tridot Users");
    XLSX.writeFile(wb, `${fileName}.xlsx`);

    // Returning false as downloading of file is already taken care of
    return false;
  }

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                <th {...column.getHeaderProps()} key={i}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={i}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <div className="page-count">
          <span>Rows per page</span>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {pageSizeOptions.map((pageSize) => (
              <MenuItem key={pageSize} value={pageSize}>
                {pageSize}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div className="page-btns">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <i className="fas fa-chevron-left"></i>
            <p>Prev</p>
          </button>
          <span>{pageIndex + 1}</span>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <p>Next</p>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
});

export default Table;
