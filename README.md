
# bluetie-assignment
Node.JS Assignment

# Description:
An inspection company wants to create a software which needs to track the progress of the Inspector while inspecting different types of venues like Home, offices, Vehicles, along with the exact location of the inspection, also the company should be able to check the status of the inspection like pending, started, approved, rejected etc date wise.

You need to create 2 Restful API which will add the data and be able to search by all the parameters, User should be authorized before adding and searching the data.

# Setup
Need the following application installed
- node js and npm
- mongodb

# Steps to run the application
- run the mongo deamon(make sure the folder path is created data/db)
 `mongod --dbpath data/db`
- run the node js application
   `npm start`
- the application will be running on **localhost:8088** and mongo on **27017** port

# Inspection Process
- First the user needs to register to get the token for adding or seaching inspection information.
  - **register api**:
      **POST**: `localhost:8088/user/register`
        **payload**: `{"name":"Avinash Shetty","email":"avinasah@abcd.com","password":"Avinash@123"}`
		**Response:** `{
    "auth": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViODU0YWIyYjc3YjQ1NTRkOTljNjlmOSIsImlhdCI6MTUzNTQ2MjA2NiwiZXhwIjoxNTM1NTQ4NDY2fQ.n2vNBsKmJAlvEJjlog-46qQlUbz-Z8EM1hGnoi815XE"
}`
	
- Use this token in the header(x-access-token) to run the inspection api's
- If the API expires use the login api to get the token again
- save inspection api:
	- **POST**: `localhost:8088/inspection`
	- **payload**: `{"venueType":"OFFICE",
"location":{
"addressLine1":"123",
"addressLine2":"45re",
"city":"Thane",
"zipCode":"400607"
},
"status":"APPROVED"}`
	- all fields mandatory
	- x-access-token header is required
	-  allowed **venueType** : ["HOME","OFFICE","VEHICLE"]
	- allowed **status**: ["PENDING","STARTED","APPROVED","REJECTED"]
- get inspection api:
	- **GET**: `localhost:8088/inspection/{searchTerm}`
	- searchTerm is a mandatory field
	- searchTerm can contain any text present in the name location and status field.
	- x-access-token header is required
- All the API's are there in the postman-api-docs folder, need to import the file to postman and the collection with the name Bluetie-API will be visible on postman.
