const { Reply } = require('../lib/Reply');


// Get Test
async function GetTest( data ) {
    try {
        return new Reply({ point: 'Service Test', data, success: true });
    } catch (error) {
        return new Reply({ point: 'Service Test', data: error });
    }
}

module.exports = { GetTest }