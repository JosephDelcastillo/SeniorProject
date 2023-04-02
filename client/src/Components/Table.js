import React, { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import DataTable from 'react-data-table-component';

import { csvButton as Export } from './Download';

function generateCSV (data, columns) {
    let csvData = ""
    columns.forEach(e => { if(e.name) csvData += e.name + ','; })
    csvData += "\n"
    data.forEach(datum => {
        columns.forEach(column => { if (column.selector) csvData += column.selector(datum) + ',' })
        csvData += "\n"
    });
    return csvData;
}

function inArr(haystack, needle) {
    for (const i in haystack) if (haystack[i] === needle) return true;
    return false;
}

function Table({ columns, data }) {
    const [filterText, setFilterText] = useState('');
    const [columnFilter, setColumnFilter] = useState([]);
	const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
    const filterInputElement = useRef();
    const filteredColumns = columns.filter(column => {
        if (!columnFilter || columnFilter.length === 0) return true;
        if (column.name == null || column.name.length <= 0) return true;
        return !inArr(columnFilter, column.name);
    });
	const filteredItems = data.filter(datum => {
        if (!filterText || filterText.length === 0) return true;
        let isAllowed = false;
        columns.forEach(column => {
            if (column.selector && column.selector(datum).toLowerCase().indexOf(filterText.toLowerCase()) >= 0) isAllowed = true;
        });
        return isAllowed;
    });

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
    function handleClear() {
        if (!filterText || filterText.length <= 0) return;
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
    };
    function setText(e) {
        if (e.target.value != null) {
            setFilterText(e.target.value)
            return;
        }
        const val = filterInputElement.current.value;
        setFilterText(val);
        filterInputElement.current.value = val;
    }
    function clearColumns() {
        if (!columnFilter || columnFilter.length <= 0) return;
        setResetPaginationToggle(!resetPaginationToggle);
        setColumnFilter([]);
    }
    function changeColumns () {
        const items = document.getElementsByClassName('columnNameCheckBox');
        let names = [];
        for (const i in items) {
            if (items[i].checked === false && items[i].name) names.push(items[i].name)
        }
        setResetPaginationToggle(!resetPaginationToggle)
        setColumnFilter(names)
    }
    const header = () => {
        return (
            <div className='col-12 g-3 row'>
                <div className='col-lg-3 col-md-5 col-sm-12 col-xs-12'>
                    <div className='input-group'>
                        <div className='btn btn-outline-danger' onClick={handleClear}> Reset </div>
                        <input type="text" id="table-filter" className="form-control" ref={filterInputElement} placeholder={filterText ? filterText : ''}/>
                        <div className='btn btn-outline-success' onClick={setText}> Apply </div>
                    </div>
                </div>
                <div className='col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 dropdown'>
                    <button className="btn btn-outline-secondary dropdown-toggle col-12" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Column Filtering
                    </button>
                    <ul class="dropdown-menu col-11 text-center">
                        <li>
                            <div className='dropdown-item'> 
                                <div className='input-group'>
                                    <button className='btn btn-outline-primary col-6' onClick={changeColumns}>Apply</button>
                                    <button className='btn btn-outline-danger col-6' onClick={clearColumns}>Reset</button>
                                </div>
                            </div>
                        </li>
                        {(columns == null || columns.length <= 0 || !Array.isArray(columns)) ? (<></>) :
                            columns.map(({name}) => {
                                if (name == null || name.length <= 0) return (<></>);
                                const check = columnFilter.length < 0 || !inArr(columnFilter, name);
                                return (
                                    <li key={uuid()}>
                                        <div className="form-check form-switch col-11 ms-4 text-left">
                                            <input className="form-check-input columnNameCheckBox" name={name} type="checkbox" role="switch" defaultChecked={check}/>
                                            <label className="form-check-label"> {name} </label>
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <Export className='col-lg-2 col-md-3 col-sm-6 col-xs-12 ms-lg-auto' data={generateCSV(filteredItems, filteredColumns)} />
            </div>
        )
    }
    return (
        <DataTable 
            subHeader
            pagination
            data={filteredItems}
            key={uuid()}
            highlightOnHover
            columns={filteredColumns} 
            progressPending={!(data)} 
            customStyles={customStyles}
            fixedHeader fixedHeaderScrollHeight="70vh"
			paginationResetDefaultPage={resetPaginationToggle}
			subHeaderComponent={header()}
        />
    )
}

export default Table