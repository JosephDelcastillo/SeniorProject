const model = require('../models/Users');
const { Reply } = require('../lib/Reply');

//Triggers create new user function
async function Create (input) {
    const { token, data } = input;
    const { name, email, type } = data;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
        if(!authorized) return new Reply({ point: 'Authorization'});

        const res = await model.Create({name, email, type});

        if(res) return new Reply({ point: 'Create Generation', success: true, data: res });
        return new Reply({ point: 'Create Generation' });
    } catch(error) {
        return new Reply({ point: 'Creation Inquiry'});
    }
}

//Triggers get staff function
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

//Triggers get current user function
async function GetCurrentUser(input) {
    const { token, data } = input;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Staff); 
        if(!authorized) return false;
        
        const user = await model.GetCurrentUser(token);
        if(user) return new Reply({ point: 'Current User Generation', success: true, data: user });
        return new Reply({ point: 'Current User Generation' });
    } catch(error) {
        return new Reply({ point: 'Current User Inquiry' });
    }
}

//Triggers gets users function
async function GetUsers(input) {
    const { token, data } = input;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
        if(!authorized) return false;
        
        const users = await model.GetUsers(data.search);
        if(users) return new Reply({ point: 'User Generation', success: true, data: users });
        return new Reply({ point: 'User Generation' });
    } catch(error) {
        return new Reply({ point: 'User Inquiry' });
    }
}

//Triggers login function
async function Login (input) {
    const { email, password } = input.data;

    try {
        const login = await model.Login({ email, password });
        if(login === false) return new Reply({point: 'Login' });

        return new Reply({ point: 'Login', data: login, success: true });
    } catch (error) {
        return new Reply({ point: 'Login Inquiry' });
    }
}

//Triggers logout function
async function Logout(input) {
    const { token, data } = input;

    try {
        const res = await model.Logout(token);
        if(user) return new Reply({ point: 'Logout', success: true, data: res });
        return new Reply({ point: 'Logout' });
    } catch(error) {
        return new Reply({ point: 'Logout Service' });
    }
}

//Triggers forgot password function
async function ForgotPassword (input) {
    const {email} = input.data;

    try {
        const response = await model.ForgotPassword({ email });
        if(response === false) return new Reply({point: 'Forgot Password' });

        return new Reply({ point: 'Forgot Password', data: response, success: true });
    } catch (error) {
        return new Reply({ point: 'Forgot Password Service' });
    }
}

//Triggers reset password function
async function ResetPassword (input) {
    const {email, token, password, password2} = input.data;

    try {
        const response = await model.ResetPassword({ email, token, password, password2 });
        if(response === false) return new Reply({point: 'Reset Password' });

        return new Reply({ point: 'Reset Password', data: response, success: true });
    } catch (error) {
        return new Reply({ point: 'Reset Password Service' });
    }
}

//Triggers edit user function
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
        return new Reply({ point: 'Edit'});
    }
}

//Triggers edit current user function
async function EditCurrentUser (input) {
    const { token, data } = input;
    const { email, name, password, password2} = data;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Staff); 
        if(!authorized) return new Reply({ point: 'Authorization'});

        const res = await model.EditCurrentUser({name, email, password, password2, token});

        if(res) return new Reply({ point: 'Edit Current User', success: true, data: res });
        return new Reply({ point: 'Edit Current User' });
    } catch(error) {
        return new Reply({ point: 'Edit Edit Current user'});
    }
}

//Triggers archive user function
async function Archive (input) {
    const { token, data } = input;
    const { email, archive } = data;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
        if(!authorized) return new Reply({ point: 'Authorization'});

        const res = await model.Archive({ email, archive});

        if(res) return new Reply({ point: 'Archive', success: true, data: res });
        return new Reply({ point: 'Archive' });
    } catch(error) {
        return new Reply({ point: 'Archive'});
    }
}

module.exports = {
    GetStaff,
    Login,
    Logout,
    Create,
    Edit,
    GetUsers,
    Archive,
    GetCurrentUser,
    EditCurrentUser,
    ForgotPassword,
    ResetPassword
}