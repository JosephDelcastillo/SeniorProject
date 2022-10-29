const model = require('../models/Users');
const Reply = require('../lib/Reply');

async function Create (data) {
    const { id } = data;
    try {
        const res = await model.Create({ id });
        return res;
    } catch(error) {
        context.res.status = 500;
        context.res.body = error;
        throw error;
    }
}


// Get Questions
async function GetQuestion(input) {
    try {
        const { token, data } = input;
        const authorized = await model.Authorize(token, model.AUTH_ROLES.Staff); 
        if(authorized) {
            let q = await model.GetQuestion(input);
            return q; 
        }
    } catch (error) {
        context.res.status = 500;
        context.res.body = error;
        throw error;
    }
}

async function GetReport(input) {
    try {
        const { token, data } = input;
        const { people, questions, dates } = data;
        if (Array.isArray(people)) {
            const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
            if(!authorized) return false;
            
            const report = await model.GetReport( people, questions, dates );
            if(report) return false;
            return report;
        } else {
            const authorized = await model.Authorize( token, model.AUTH_ROLES.Staff); 
            if(!authorized) return false;
            
            const report = await model.GetReport([ people ], questions, dates );
            if(report) return false;
            return report;
        }
    } catch (error) {
        return false;
    }
}

async function GetStaff(input) {
    const { token, data } = input;
    try {
        const authorized = await model.Authorize( token, model.AUTH_ROLES.Admin); 
        if(!authorized) return false;
        
        const staff = await model.GetStaff(data.search);
        if(staff) return staff;
        return false;
    } catch(error) {
        return false;
    }
}

async function Login (username, password) {
    try {
        return model.Login({ username, password });
    } catch (error) {
        return false; 
    }
}

module.exports = {
    GetQuestion,
    GetReport,
    GetStaff,
    Login,
    Create
}