const db = require('../lib/DBConnection');

const table = db.GetTable(db.TABLES.User);

async function GetTableId() {
    const i = table.id;
    return i;
}

function Create (data) {
    console.log('Create Model')
    const { id } = data;
    // TODO: Build Create 
    return id; // Replace with New User ID or other reference 
}

module.exports = {
    GetTableId,
    Create
}