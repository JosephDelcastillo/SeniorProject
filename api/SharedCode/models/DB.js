const { GetContainer, CONTAINERS } = require('../lib/DBTest');

// Test
async function Test (data) {
    return new Promise(async resolve => {
        const table = GetContainer(CONTAINERS.User);
        resolve ({ table });
        return { table };
    });
}

module.exports = {
    Test
}