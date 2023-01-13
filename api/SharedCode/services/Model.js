const model = require('../models/Test');
const { Reply } = require('../lib/Reply');


// Get Test
async function TestModel( info ) {
    try {
        const data = await model.Test(info);
        return new Reply({ point: 'Model Test', data, success: true });
    } catch (error) {
        return new Reply({ point: 'Model Test', data: error });
    }
}

module.exports = { TestModel }