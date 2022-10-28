const model = require('../models/Users');
const Reply = require('../lib/Reply');

async function GetUsersTableId() {
    const i = model.GetTableId()
    return i;
}

async function Create (context, data) {
    const { id } = data;
    // TODO: Build this function 
    try {
        const new_user = await model.Create({ id });
        context.res.body = new Reply({ success: true, data: new_user, point: 'Create User' }); 
    } catch(error) {
        context.res.status = 500;
        context.res.body = error;
        throw error;
    }
}

module.exports = {
    GetUsersTableId,
    Create
}