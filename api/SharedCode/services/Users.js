const model = require('../models/Users');
const { Reply } = require('../lib/Reply');

async function Create (input) {
    const { token, data } = input;
    const { name, email, password, type } = data;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
        if(!authorized) return false;

        const res = await model.Create({name, email, password, type});

        if(res) return new Reply({ point: 'Create Generation', success: true, data: res });
        return new Reply({ point: 'Create Generation' });
    } catch(error) {
        //return new Reply({ point: 'error'});
        return new Reply({ point: 'Creation Inquiry'});
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

async function Login (email, password) {
    try {
        const login = model.Login({ email, password });
        return login;
    } catch (error) {
        return new Reply({ point: 'Login Inquiry' });
    }
}

module.exports = {
    GetStaff,
    Login,
    Create
}