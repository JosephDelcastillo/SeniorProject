const { Users } = require('../lib/DBConnection');

// Test
async function Test (data) {
    return new Promise(async resolve => {
        resolve ({ Users });
        return { Users };
    });
}

module.exports = {
    Test
}