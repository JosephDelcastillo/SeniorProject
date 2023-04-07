import React from 'react'


function Question({ id, type, text, number, show_number=true }) {
    if (!(id && type && text)) return false;
    return (<>
        <div className="row mb-2">
            <div className="call-12">
                <h4>{show_number?(number + 1) + ") ":''}{text}</h4>
            </div>
            <div className="call-12">
                {(type.toLowerCase() === "note")? (
                    <textarea name={id} id={id} className='form-control'></textarea>
                ):(
                    <input name={id} id={id} type="number" className='form-control'></input>
                )}
            </div>
        </div>
        {(type.toLowerCase() === "note") && (<hr />)}
    </>)
}

export default Question