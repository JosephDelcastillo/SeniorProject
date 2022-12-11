module.exports = async function (context, req) {
    context.log.verbose('Basic Function Triggered ');
    context.log.verbose(process.env["URI"]);
    context.log.verbose(process.env["COSMOS_ENDPOINT"]);
    context.log('JavaScript HTTP trigger function processed a request.');

    const name = (req.query.name || (req.body && req.body.name));
    const responseMessage = name
        ? "Hello, " + name + ". Welcome to the EPOTS api."
        : "This HTTP triggered function executed successfully. Welcome to the EPOTS api.";

    context.res = {
        status: 200, /* Defaults to 200 */
        body: responseMessage
    };
}