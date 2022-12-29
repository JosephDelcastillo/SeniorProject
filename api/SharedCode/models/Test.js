
// Test
async function Test (data) {
    return new Promise(async resolve => {
        resolve ( data );
        return data;
    });
}

module.exports = {
    Test
}