import React from 'react'

function Loading({ blank=false }) {
    if (blank) return <></>

    return (
        <div>Loading...</div>
    )
}

export default Loading