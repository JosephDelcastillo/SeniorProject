import React from 'react'

export const ACTION_TYPES = {
    VIEW: 'VIEW', 
    EDIT: 'EDIT',
    DEL: 'DEL',
    RES: 'RES',
    INFO: 'INFO'
}

function Action({ type, action, classes = '', style = '' }) {
    if (!Object.values(ACTION_TYPES).includes(type)) return <></>

    let symbol = ''
    switch(type){
        case ACTION_TYPES.VIEW:
            symbol = 'fa-eye text-info'
            break;
        case ACTION_TYPES.EDIT:
            symbol  = 'fa-pencil text-info'
            break;
        case ACTION_TYPES.DEL:
            symbol  = 'fa-trash-can text-danger'
            break;
        case ACTION_TYPES.RES:
            symbol  = 'fa-rotate-left text-warning'
            break;
        case ACTION_TYPES.INFO:
            symbol  = 'fa-circle-info text-info'
            break;
        default:
            symbol = 'fa-circle-question text-light'
            break;
    }

    return <i className={`fa-solid ${symbol} pe-1 c-pointer ${classes}`} styles={`${style}`} onClick={action}></i>
}

export default Action