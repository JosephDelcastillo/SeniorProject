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
        const {id, text, type, goals} = data;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);

        if(!isAdmin) return new Reply({point: 'Update Question Inquiry; Does Not Have Permissions'});

        const questions = await model.GetQuestionById(id);

        if(!questions || questions.length === 0 || !("text" in questions[0])) return new Reply({point: 'No Question Selected to Edit', data: {id,questions}});
        //if(questions[0].text !== text) return new Reply({point:'Text Matching', data: questions[0]});

        const output = await model.EditQuestion(questions[0], text, type, goals);
        if(!output || !output.id) return new Reply({point: 'Failed to Update Question Content', data: output.id});
        return new Reply({point: 'Question Content Updated', success: true, data: output});
    } catch (error) {
        return new Reply({ point: 'Question Content Update Inquiry' });
    }

}
async function ArchiveQuestion(input){
    try{      
        const { token, data } = input;
        const { id, status } = data;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);

        if(!isAdmin) return new Reply({point: 'Authorization'});

        // Attempt Archive 
        const output = await model.ArchiveQuestion(id, status, isAdmin.id);
        if(!output || !output.id) return new Reply({point: 'Failed to Update Question Archive Status', data: id});
        
        // Publish 
        return new Reply({point: 'Archiving the Question', success: true, data: output});
    } catch (error) {
        return new Reply({ point: 'Question Archive Inquiry' });
    }

}
async function AddQuestion (input) {
    try {
        const { token, data } = input;
        const authorized = await Authorize(token); 
        if(!authorized) return new Reply({ point: 'Authorization' });
        const { text, type } = data;

        const success = await model.AddQuestion({ text, type});
        if(success) return new Reply({ point: 'Add Question', success: true, data: success });
        return new Reply({ point: 'Add Question' });
    } catch (error) {
        return new Reply({ point: 'Add Question Inquiry', success: true, data: output});
    }
}
async function OrderChange(input){
    try{
        const{token, data} = input;
        const {id, priority} = data;
        const isAdmin = await Authorize(token, AUTH_ROLES.Admin);
        if(!isAdmin || !isAdmin.id) return new Reply({point: 'Authorization'});
        
        const output = await model.OrderChange(id, priority, isAdmin.id);
        if(output === false) return new Reply({point: 'Update Question Priority', data: { output, data } });

        return new Reply({point: 'Question Priority Content Updated', success: true, data: output});
    } catch (error) {
        return new Reply({ point: 'Question Priority Content Update Inquiry' });
    }

}
async function AddSubmission(input) {
    try {
      const { token, data } = input;
  
      const otherIdIndex = data.length - 1;

      let success;
  
      const authorized = await Authorize(token, AUTH_ROLES.Staff);
      const adminCheck = await Authorize(token, AUTH_ROLES.Admin);
      if (!authorized) {
        return new Reply({ point: "Authorization" });
      }
      if(data[otherIdIndex].value !="Myself" && adminCheck != false){//If the admin check fails, even if they are trying to submit for someone else, it will default to submitting for themselves.
                newID = data[otherIdIndex].value
                delete data[otherIdIndex]//Remove the inserted extra identifier to make sure it causes no problems in Model
                success = await model.AddSubmission({
                user: newID,
                data,
            });
        }
    else{
        delete data[otherIdIndex]//Remove the inserted extra identifier to make sure it causes no problems in Model
        success = await model.AddSubmission({ user: authorized.id, data });
        }
    
      if (success) {
        return new Reply({ point: "Add Submission", success: true, data: success });
      } else {
        return new Reply({ point: "Add Submission" });
      }
    } catch (error) {
      return new Reply({ point: "Add Submission Inquiry", error });
    }
  }

module.exports = {
    ArchiveQuestion,
    EditQuestion,
    AddSubmission,
    GetQuestion,
    AddQuestion,
    OrderChange,
}