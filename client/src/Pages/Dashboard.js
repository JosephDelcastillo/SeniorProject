import React, { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Dashboard Page 
 * @param {Function} parameters Get Logged In Token
 * @returns {React.Component} 
 */
function Dashboard({ getToken }) {
    const [quote, setQuote] = new useState({})
    
    useEffect(() => {
        axios.get('https://seussology.info/api/quotes/random/1').then(response => setQuote({text: response.data[0].text, book: response.data[0].book.title}));
    }, [setQuote])

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
                <img src='https://via.placeholder.com/500/8888FF/png?text=PlaceHolder' alt='PlaceHolder' />
            </div>
        </div>
    )
}

export default Dashboard