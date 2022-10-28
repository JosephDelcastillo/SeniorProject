const model = require('../models/Users');
const Reply = require('../lib/Reply');

async function GetUsersTableId() {
    try {
        const i = model.GetTableId()
        return i;
    } catch (error) {
        return error;
    }
}

async function Create (data) {
    console.log('Create Service Attempt')
    const { id } = data;
    console.log(id)
    // TODO: Build this function 
    try {
        console.log('Create Service: New User Obtainer')
        const res = await model.Create({ id });
        console.log('res')
        console.log(res)
        return res;
    } catch(error) {
        console.log('Create Service: Error')
        context.res.status = 500;
        context.res.body = error;
        throw error;
    }
}

module.exports = {
    GetUsersTableId,
    Create
}