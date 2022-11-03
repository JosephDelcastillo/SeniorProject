# Services
## Functions Structure
### Asynchronous  
All Services should be use the `async` keyword to denote asynchronous behavior. This will allow the functions to run at the pace of the query, without errors. 
```javascript
async function asyncFunction() {
	// Preform Service Functions
}
```

### Try-Catch
All Services should operate using `try` ,`catch` blocks to catch the errors that may come up when running the data model. This looks like the follow: 
```javascript 
try {
	let data = await model.function();
} catch (error) {
	let data = error;
}
```

### Return [Replies](Library#Reply)
All Services should return a Reply. This allows for easy communication back to the user as to what broke as well as why. Best practice is to create the reply when information need to be returned, as this can also allow you to stop functions when they reach an error. Examples are below
#### Authentication Fail
Authentication should return a Reply, allowing failed authentications to be checked and returned easily.
```javascript 
const auth = service.authenticate(token, role);
if(!auth.success) return auth;
```
#### Model Failure
Models fail during execution trigger errors that should be caught, then they can returned as the `data` (or hidden for security). Note the inclusion of the `point`, including relevant information to the service can help, as well as instructional steps in complex services. 
```javascript 
catch (data) {
	return new Reply({ point: 'Service Name', data })
}
```

#### Service Success
During a success, all parameters should be filled out, though setting `success` to true is the part that matters most. 
```javascript 
return new Reply({ point: 'Service Name', data, success: true })
```

## Existing Services
### [Forms](Forms.js)
#### Get Questions 
Parameters: 
- search (`string`)
Gets Questions Based on Search Input, currently ignores notes. 
#todo Planning on adding `Is Note` as search flag
 
### [Users](Users.js) 
#### Create
Not built, still just a test function shell 

#### Login
Parameters:
- email (`string`)
- password (`string`)
Note: Not functioning yet. Takes in user information and returns a token key if validated. 

#### Get Staff
Parameters 
- search (`string`)
Gets Staff `Users` based on the `search` Input.


### [Reports](Reports.js)
Access all data related to the Reports. 

#### Get 
Parameters: 
- people (`array`|`int`)
- questions (`array`|`int`)
- dates (`object`<start: `String`, end: `String`>)
The Get function triggers report generation. This takes in all the parameters, and if the user has correct authorization for it, runs a report based on that criteria. 