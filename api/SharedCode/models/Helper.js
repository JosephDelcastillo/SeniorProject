const tb = require('../lib/Helpers');

// Test
async function Test (data) {
    return new Promise(async resolve => {
        const salt = await tb.genSalt();
        resolve ( { data, salt } );
        return data;
    });
}

module.exports = {
    Test
}