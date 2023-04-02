import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

/**
 * Dashboard Page 
 * @param {Function} parameters Get Logged In Token
 * @returns {React.Component} 
 */
function Dashboard({ isAdmin, getToken, api }) {
    const [quote, setQuote] = new useState({})
    const [ backendData, setBackendData ] = useState([{}]);
    
    useEffect(() => {
        axios.get('https://seussology.info/api/quotes/random/1').then(response => setQuote({text: response.data[0].text, book: response.data[0].book.title}));
    }, [setQuote])

    useEffect(() => {
        async function fetchData() {
            const input = {
                people: -202,
                question: [{}],
                dates: { start: '01-01-1999', end: new Date().toISOString().slice(0, 10) }
            }

            const { success, data } = await api({ func: 'GetReport', data: input });
            if (!success) return Swal.fire({ icon: 'error', title: 'Error Retreiving Main Report' })
            setBackendData(data);
        }
        fetchData();
    }, [api, getToken, isAdmin, setBackendData])

    console.log(backendData)
    return (
        <div className="card m-2 border-none">
            <div className="card-header bg-white text-center">
                <h1> Dashboard </h1>
            </div>
            <div className="card-body text-center">
                {(quote && quote.text && quote.book) && (
                    <figure>
                        <blockquote className="blockquote">
                            <p>{quote.text}</p>
                        </blockquote>
                        <figcaption className="blockquote-footer">
                            Dr. Suess, <cite title="Source Title">{quote.book}</cite>
                        </figcaption>
                    </figure>
                )}
                {/* TODO: Add Question Dropdown Select */}
                {/* TODO: Add Backend Data Report */}
                <img src='https://via.placeholder.com/500/8888FF?text=PlaceHolder' alt='PlaceHolder' />
            </div>
        </div>
    )
}

export default Dashboard