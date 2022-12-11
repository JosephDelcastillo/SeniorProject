const { Users } = require('../lib/DBConnection');

// Test
async function Test (data) {
    return new Promise(async resolve => {
        resolve ({ Users: Users.id });
        return { Users: Users.id };
    });
}

module.exports = {
    Test
}