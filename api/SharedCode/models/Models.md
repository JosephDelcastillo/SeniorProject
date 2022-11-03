# Models
## Structure
### Database
All Models Connect to the Database to acquire the table that the model works over. 

### Functions
#### Asynchronous  
All functions should be use the `async` keyword to denote asynchronous behavior. This will allow the functions to run at the pace of the query, without errors. 

#### Promises
All functions return **Promises**, when the query is considered completed, that Promise can be resolved. Promises are created with `resolve` as the parameter, with a pointer function to the function body. Then by calling the `resolve` function, you can complete the promise and return a value. 
```javascript 
return new Promise(resolve => {
	// Do Something
	let output = {}
	// When done, return outputs; 
	resolve(output); 
})
```

## Existing Models
### Forms
#### Databases
- `Questions` 
#### Get Questions 
parameters: 
- search (`string`)
Gets `Questions` that have similar text to the `search` Input, currently ignores notes. 
#todo Planning on adding `Is Note` as search flag
- 
### Users 
Access all data related to the Users.
#### Databases
- `Users`
- `Sessions` 
#### Create
Not built, still just a test function shell 

#### Login
Parameters:
- email (`string`)
- password (`string`)
First checks for `Users` with that `email`, then checks for user with that `email` and `password`. The reply point in the request serves to differentiate between which is missing. If the correct `user` is found, then a new `Session` is made, and the user is sent the corresponding `Session` token.  
Note: Not functioning yet. 

#### Get Staff
Parameters 
- search (`string`)
Gets Staff `Users` based on if their name or email is similar to the `search`.


### Reports
Access all data related to the Reports. 
#### Databases
- `Responses`
- `Submissions` 
#### Get 
Parameters: 
- people (`array`|`int`)
- questions (`array`|`int`)
- dates (`object`<start: `String`, end: `String`>)
The Get function pulls report information. First, `Submissions` are obtained based on `people` and `dates` input. Then from those `Submissions`, and the `questions` filter, the corresponding `Responses` are pulled per `Submission`.