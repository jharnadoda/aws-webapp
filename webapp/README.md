**Assignment #01**

Web Application Development
Create a web application using a technology stack that meets Cloud-Native Web Application Requirements. Start implementing APIs for the web application. Features of the web application will be split among various applications. For this assignment, we will focus on the backend API (no UI) service. Additional features of the web application will be implemented in future assignments. We will also build the infrastructure on the cloud to host the application. This assignment will focus on the user management aspect of the application. You will implement RESTful APIs based on user stories you will find below.

**API Documentation**

Assignment #01 - https://app.swaggerhub.com/apis-docs/csye6225-webapp/cloud-native-webapp/spring2023-a1 (Links to an external site.) 



**Node Web App.**
This Node Web App is a simple health check REST API.


**Prerequisite and Technology:**
Node.js
Express.js
MySQL   
git and github
Postman
Visual Studio Code


**Running the project**
- Clone the repository: git@github.com:jharna-northeastern/webapp.git 
- Install dependencies `npm install`
- Run it: `node server.js`


Once the application is started you can access following APIs through postman.
1. GET: http://localhost:3000/healthz
2. POST: http://localhost:3000/v1/user
3. GET: http://localhost:3000/v1/user/1
4. PUT: http://localhost:3000/v1/user/1

Note: The 3rd and 4th API requires basic authentication i.e. if the user exists than only the API will execute successfully. Authentication using BasicAuth. 


## Running Test
- Run `npm run test`  


## Assignment 4

Run workflow from github (creates AMI)
run tf apply on terraform
check on postman

Assignment 5
Run workflow
tf apply creates ec2, rds, s3
test on postman
update
assignment 7 code review


## Assignment 9

**AWS CLI Command to import SSL certificate**

> aws acm import-certificate --certificate fileb://prod_jharnadoda_me.crt \
--certificate-chain fileb://prod_jharnadoda_me.ca-bundle \
--private-key fileb://PrivateKey.pem


