const { GetContainer, CONTAINERS } = require('../lib/DBTest');
const tb = require('../lib/Helpers');

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