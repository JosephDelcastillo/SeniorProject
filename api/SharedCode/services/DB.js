const model = require('../models/DB');
const { Reply } = require('../lib/Reply');


// Get Test
async function Test( info ) {
    try {
        const data = await model.Test(info);
        return new Reply({ point: 'DB Test', data, success: true });
    } catch (error) {
        return new Reply({ point: 'DB Test', data: error });
    }
}

module.exports = { Test }