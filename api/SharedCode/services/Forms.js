const model = require('../models/Forms');
const { Authorize, AUTH_ROLES } = require('../models/Users');
const { Reply } = require('../lib/Reply');

// Get Questions
async function GetQuestion(input) {
    try {
        const { token, data } = input;
        const authorized = await Authorize(token, AUTH_ROLES.Staff); 
        if(!authorized) return new Reply({ point: 'Authorization' });
        
        const q = await model.GetQuestion(data.search, data.no_notes || false);
        if(q) return new Reply({ point: 'Question Generation', success: true, data: q });
        return new Reply({ point: 'Question Generation' });
    } catch (error) {
        return new Reply({ point: 'Question Inquiry' });
    }
}
async function EditQuestion(input){
    try{
        const{token, data} = input;
        const {id, text, type} = data;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);

        if(!isAdmin) return new Reply({point: 'Update Question Inquiry; Does Not Have Permissions'});

        const questions = await model.GetQuestionById(id);

        if(!questions || questions.length === 0 || !("text" in questions[0])) return new Reply({point: 'No Question Selected to Edit', data: {id,questions}});
        //if(questions[0].text !== text) return new Reply({point:'Text Matching', data: questions[0]});

        const output = await model.EditQuestion(questions[0], text, type);
        if(!output || !output.id) return new Reply({point: 'Failed to Update Question Content', data: output.id});
        return new Reply({point: 'Question Content Updated', success: true, data: output});
    } catch (error) {
        return new Reply({ point: 'Question Content Update Inquiry' });
    }

}
async function ArchiveQuestion(input){
    try{      
        const{token, data} = input;
        const {id, status} = data;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);

        if(!isAdmin) return new Reply({point: 'Archive Question Inquiry; Does Not Have Permissions'});

        const questions = await model.GetQuestionById(id);
        //console.log(!questions, questions.length === 0, !questions[0].hasOwnProperty("archived"));
        if(!questions || questions.length === 0 || !questions[0].hasOwnProperty("archived")) return new Reply({point: 'Failed to Retreive Question', data: {id,questions}});
        if(questions[0].archived === status) return new Reply({point:'Status Matching', success: true, data: questions[0]});
        
        const output = await model.ArchiveQuestion(questions[0], status);
        if(!output || !output.id) return new Reply({point: 'Failed to Update Question Archive Status', data: id});
        return new Reply({point: 'Archiving the Question', success: true, data: output});
    } catch (error) {
        return new Reply({ point: 'Question Archive Inquiry' });
    }

}

async function AddSubmission (input) {
    try {
        const { token, data } = input;
        const authorized = await Authorize(token); 
        if(!authorized) return new Reply({ point: 'Authorization' });
        
        const success = await model.AddSubmission({ user: authorized.id, data });
        if(success) return new Reply({ point: 'Add Submission', success: true, data: success });
        return new Reply({ point: 'Add Submission' });
    } catch (error) {
        return new Reply({ point: 'Add Submission Inquiry' });
    }
}

module.exports = {
    ArchiveQuestion,
    EditQuestion,
    AddSubmission,
    GetQuestion
}