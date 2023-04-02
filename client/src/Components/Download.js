export function csv (data, name='download') {
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', `${name}.csv`)
    a.click()
}

export function csvButton({ data, text='Export CSV', filename='download', className }) {
    return (
        <div className={`btn btn-outline-info ${className}`} onClick={e => csv(data, filename)}>
            {text}
        </div>
    )
}