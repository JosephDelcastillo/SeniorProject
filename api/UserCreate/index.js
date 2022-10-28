// Imports 
const service = require('../SharedCode/services/Users');

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    if (!req.body) {
        return context.res = {
            status: 400,
            body: "Please pass data to the request body"
        };
    } 
    else {
        return context.res = {
            status: 200,
            body: req.body
        };
    }

    // try {
    //     console.log('Start')
    //     const data = req.body;
        
    //     console.log('Data Obtained')
    //     console.log(data.id)
    //     console.log('Running')
    //     if (!data.id) { 
    //         console.log('Missing Input')
    //         return context.res = {
    //             status: 400,
    //             body: "Please pass id in the request body" + req.body
    //         };
    //     }

    //     console.log('ID')
    //     console.log(data.id)
    //     const result = await service.Create(data);
    //     console.log('result: ')
    //     console.log(result)
    //     if(!result) {
    //         return context.res = {
    //             status: 400,
    //             body: "Service Failed to Execute"
    //         };
    //     } 
    //     return context.res = {
    //         body: result
    //     };
    // } catch (error) {
    //     return context.res = {
    //         status: 500,
    //         body: error 
    //     };
    // }
}