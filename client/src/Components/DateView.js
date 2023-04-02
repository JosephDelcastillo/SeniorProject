function DateView({ str, date = true, time = true, seconds = false, hour12 = false }) {
    if (!str || str === null || !str.length || str.length <= 0) return '';
    let output = "";
    if (date) output += str.substr(0, str.indexOf('T')) + ' ';
    if (time) {
        let time = str.substr(str.indexOf('T') + 1, seconds ? 8 : 5)
        if (hour12) {
            let hour = parseInt(time.substr(0, 2))
            const pm = hour > 12
            hour = (hour === 12 || hour === 24) ? 12 : hour % 12;
            time = (hour >= 10 ? '0' : '') + hour + time.substr(2) + (pm ? 'PM' : 'AM')
        }
        output += time + ' ';
    }
    return output
}

export default DateView