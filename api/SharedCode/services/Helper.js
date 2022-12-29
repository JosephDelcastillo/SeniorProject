const model = require('../models/Helper');
const { Reply } = require('../lib/Reply');


// Get Test
async function TestHelper( info ) {
    try {
        const data = await model.Test(info);
        return new Reply({ point: 'Model Test', data, success: true });
    } catch (error) {
        return new Reply({ point: 'Model Test', data: error });
    }
}

module.exports = { TestHelper }