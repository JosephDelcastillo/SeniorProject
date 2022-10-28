const db = require('../lib/DBConnection');

const table = db.GetTable(db.TABLES.User);

async function GetTableId() {
    const i = table.id;
    return i;
}

async function Create (data) {
    return new Promise(resolve => {
        // TODO: Access Database 
        console.log('Create Model')
        const { id } = data;
        console.log(id)

        // Replace with New User ID or other reference 
        resolve({ id, info: 'Hit' });
    });
}

module.exports = {
    GetTableId,
    Create
}