# API
This is the Home of the [EPOTS](../README.md) Function API 

## Functions Structure 
### Root Files
Important files to know, that may change when developing the API 
#### [package.json](package.json)
Dependencies matter here more then anything. 
**Do Not Make Changes to this Document**

#### [.gitignore](.gitignore) 
Ignores Specific Files and Folder for security and space-saving sake

#### [.funcignore](.funcignore) 
Ignores Specific Files and Folder from deployed function app

### Folders  
#### [SharedCode](SharedCode/SharedCode.md)
This is a container for everything that is a Function Trigger. This includes Services, Models, and the DB Connector 
##### [Library](SharedCode/lib/Library.md)
This section contains all of the necessary reference files for the system to run, as well as helpers to easer internal system communication. 

##### [Models](SharedCode/models/Models.md)
This section contains the database access layer, where interactions with the system's database are housed to be use by any service that needs them. 

##### [Services](SharedCode/services/Services.md) 
Services are the actual operations to be preformed. This acts like the server-side Controller, triggering database actions through models, then returning the final output back to the user. 

#### Triggers
All Folders that are not within [SharedCode](#SharedCode) are **Function Triggers**. These all use and are deploying using the [AZURE Functions](https://learn.microsoft.com/en-us/azure/azure-functions/), so refer to their [documentation](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-vs-code-node) for use reference. 

##### function.json
The Function JSON file defines the input and out for the trigger, as well as its type. For our application you can reuse the same file with the only property to lookout for being method. 

##### index.js
This is the heart of the Trigger Function, from here you can validation the input and then utilize services to preform necessary operations. 

##### sample.dat
For right now, you can ignore this file 

## Functions Application Information 

### Creating New Functions 
1. Duplicate the `BaseHTTPTrigger` folder (contents and all)
2. Rename the new folder to the **name of your trigger**
	Note: This is the url that will be hit to trigger the function run
3. Validate methods
	1. Go into `function.json`
	2. Go to `methods`
	3. Fill the array with your desired methods (Pick any of these):
		1. get
		2. post
		3. put
	4. Save `function.json`
4. Update Service
	1. Go into `index.js`
	2. Edit the core function to validate the data and execute services
	3. Save `index.js`
5. Test and Save 

### Testing
1. Press `F5` to start a local functions server. 
2. Once ready, the output terminal will show the local test links. 
3. Open your API testing environment 
	1. For ThunderClient:
		1. Press `CTRL`+`SHIFT`+`R` 
		2. Then Click `New Request`
4. Select from the dropdown the method you with to use. The most common ones are likely to be: 
	1. `GET`
	2. `POST`
	3. `PUT`
	4. `DELETE`
5. Enter the url for the function you wish to test (All options should be in the output terminal)
6. Enter any data you may need below
	1. `GET`
		1. Query `Parameter`: What your API expects to receive
		2. Query `Value`: Data to send the API 
	2. `POST`
		1. Body `JSON`
			1. Enter your JSON as you would build it on the site to test how the function will receive it
7. Press `Send`
8. Find and Fix Bug 
9. Manually restart the server. 
	1. Press `CTRL`+`SHIFT`+`F5` to stop the server
	2. Then press `F5` to restart it back.