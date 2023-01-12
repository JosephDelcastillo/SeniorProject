const model = require('../models/Users');
const { Reply } = require('../lib/Reply');

async function Create (input) {
    const { token, data } = input;
    const { name, email, password, type } = data;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
        if(!authorized) return new Reply({ point: 'Authorization'});

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


async function Login (input) {
    console.log("Made it to service!!");
    const { email, password } = input.data;

    console.log("email: " + email);
    console.log("password: " + password);
    try {
        console.log('Attempt Login')
        const login = await model.Login({ email, password });
        console.log('Login Complete')
        console.log(login)
        if(login === false) return new Reply({point: 'Login' });

        return new Reply({ point: 'Login', data: login, success: true });
    } catch (error) {
        console.log("Error in services triggered");
        return new Reply({ point: 'Login Inquiry' });
    }
}

async function Edit (input) {
    const { token, data } = input;
    const { name, oldemail, email, type } = data;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
        if(!authorized) return new Reply({ point: 'Authorization'});

        const res = await model.Edit({name, oldemail, email, type});

        if(res) return new Reply({ point: 'Edit', success: true, data: res });
        return new Reply({ point: 'Edit' });
    } catch(error) {
        //return new Reply({ point: 'error'});
        return new Reply({ point: 'Edit'});
    }
}

module.exports = {
    GetStaff,
    Login,
    Create,
    Edit
}