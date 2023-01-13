import React from 'react'
import DataTable from 'react-data-table-component';

function Table({ columns, data }) {
    const customStyles = {
        headRow: {
            style: {
                fontSize: '1rem',
                borderBottom: 'none'
            },
        },
        headCells: {
            style: {
                fontSize: '1rem',
                borderBottom: 'none'
            },
        },
    }

    return (
        <DataTable 
            progressPending={!(data)} 
            columns={columns} 
            data={data}
            customStyles={customStyles}
            highlightOnHover
            pagination />
    )
}

export default Table