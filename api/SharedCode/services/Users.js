const model = require('../models/Users');
const { Reply } = require('../lib/Reply');

async function Create (data) {
    const { id } = data;
    try {
        const res = await model.Create({ id });
        if(res) return new Reply({ point: 'Create Generation', success: true, data: res });
        return new Reply({ point: 'Create Generation' });
    } catch(error) {
        return new Reply({ point: 'Creation Inquiry' });
    }
}

async function GetStaff(input) {
    const { token, data } = input;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
        if(!authorized) return false;
        
        const staff = await model.GetStaff(data.search);
        if(staff) return new Reply({ point: 'Staff Generation', success: true, data: staff });
        return new Reply({ point: 'Staff Generation' });
    } catch(error) {
        return new Reply({ point: 'Staff Inquiry' });
    }
}

async function Login (username, password) {
    try {
        const login = model.Login({ username, password });
        
        if(login) return new Reply({ point: 'Login Generation', success: true, data: login });
        return new Reply({ point: 'Login Generation' });
    } catch (error) {
        return new Reply({ point: 'Login Inquiry' });
    }
}

module.exports = {
    GetStaff,
    Login,
    Create
}