import React from 'react';
// import { v4 as uuid } from 'uuid';
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
        // <table className='table table-hover table-striped'>
        //     <thead className='table-head'>
        //         <tr>
        //             {columns.map(({ name }) => <th scope='col' key={uuid()}>{name}</th>)}
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {data.map(row => 
        //             <tr key={uuid()}>
        //                 {columns.map(col => <td key={uuid()}>{('cell' in col) ? col.cell(row) : col.selector(row)}</td>)}
        //             </tr>
        //         )}
        //     </tbody>
        // </table>


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