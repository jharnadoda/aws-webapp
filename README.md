# aws-webapp
This is a Cloud Native Web Application hosted on AWS. 

# Technology and Prerequisite :
- NodeJS
- Express.js
- MySQL   
- git and github
- Terraform
- Packer
- SystemD
- Postman
- Visual Studio Code


# API Endpoints
GET: /healthz --> Health endpoint
POST: /v1/user --> Create a user account
GET: /v1/user/{userId} --> Get User Account Information
PUT: /v1/user/{userId} --> Update User's account information

POST: /v1/product --> Add a new product
PUT: /v1/product/{productId} --> Update Product
PATCH: /v1/product/{productId} --> Update Product
DELETE: /v1/product/{productId} --> Delete Product
GET: /v1/product/{productId} --> Get Product Information

GET: /v1/product/{product_id}/image --> Get List of All Images Uploaded
POST: /v1/product/{product_id}/image --> Upload a document
GET: /v1/product/{product_id}/image/{image_id} --> Get Image Details
DELETE: /v1/product/{product_id}/image/{image_id} --> Delete the image

# AWS Resources Created: VPC, AMI, EC2, Subnets, Security Groups, Internet Gateway, Route Table (public and private),  

# Webapp
- Install dependencies `npm install`
- Run it: `node server.js`

# Running Test
- Run `npm run test`  

# aws-infra
Create infrastructure using terraform: Create VPC, 3 public subnets, 3 private subnets, an internet gateway, a public route table, a private route table

# Steps to run

terraform init - to initialize terraform. Need to run only once
terraform plan - to get the setup for terraform apply. Need to run only once.
Give the variables values in terraform.tfvars file.
terraform apply- to generate the plan and create infrastructure with default values
terraform destroy - to destroy the infrastructure created

# Additional terraform commands

terraform apply -var-file - to apply a varaibles file
terraform apply -var = - to apply variables to a file at runtime
To run the variable file : terraform apply -var-file="terraform.tfvars"
terraform destroy -var-file="terraform.tfvars" - to delete with the var file that you is created
