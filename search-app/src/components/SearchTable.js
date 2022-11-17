import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';

import axios from "axios";

const columns = [
    { field: 'id', headerName: 'Book ID' },
    { field: 'title', headerName: 'Title', width: 600 },
    { field: 'author', headerName: 'Author', width: 600 }
]

export default function SearchTable() {
    const [tableData, setTableData] = useState([])
    const [selectedRows, setSelectedRows] = useState([])
    useEffect(() => {
        axios
        .get("https://gutendex.com/books")
        .then((res) => {
            const data = res.data.results.map((d) => ({
                id: d.id,
                title: d.title,
                author: d.authors[0].name
            }));
            setTableData(data);
        })
        .catch((error) => {
            console.log(error);
        });
    });

  return (
    <div style={{ height: 700, width: '100%' }}>
      <DataGrid
        rows={tableData}
        columns={columns}
        pageSize={12}
        checkboxSelection
        onSelectionModelChange={(ids) => {
            const selectedIDs = new Set(ids);
            const selectedRows = tableData.filter((row) =>
              selectedIDs.has(row.id),
            );
            setSelectedRows(selectedRows);
        }}
      />
      <h2>Sort List Table</h2>
      <DataGrid 
        rows={selectedRows}
        columns={columns}
      />
    </div>
  )
}
