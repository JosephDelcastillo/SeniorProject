# Library
## Files 
### [DBConnection](DBConnection.js) 
The Database Connection document connects to the Cosmos Database, and sets up the links to the tables for ease of use later. 

### [DBDevelopment](DBDevelopment.js)
This is the Dummy Database brought over from development. This is designed as a temporary patch, so future development should work instead using the [Database connection](DBConnection.js). 

### [Reply](Reply.js) 
The Reply Object is the common communicator for returning information to the client. This structures the information in a format that allows for easy validation and communication throughout this project. 
#### Inputs
Reply takes in 3 Possible Inputs: `data`, `point`, and `success`. 
##### `data`
Type: `Object`
Data is how anything of use is returned to the user. This acts as a kind of catchall for most returns. 
##### `point`
Type: `String`
Point is the place where the error was occurred at or which service succeeded. 
##### `success`
Type: `Boolean`
Success is whether the function succeeded, at this step or if this is a fail log.
#### Outputs
##### `data`
Type: `Object`
The same is the input.
##### `message`
Type: `String`
A condensed string for comprehension and/or user communication in the form of `[Succeeded or Failed] at [Point]`. 
##### `success`
Type: `Boolean`
Same as input, Boolean of success or failure. 

### [Helpers](Helpers.js)
General Helper Functions for use throughout other services or models 

#### String LIKE
Parameters
- haystack (`String`)
- needle (`String`)
Searches the `haystack` for the `needle` and returns `true` if found. Also converts all to lowercase, so this is **not case sensitive**.