const basicAuth = require('express-basic-auth');
const e = require("express");
const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const bcrypt = require('bcrypt');
const logger = require('../config/logger');
const StatsD = require('node-statsd');

const statsDClient = new StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'CSYE6225_'
});

// Create and Save a new User
exports.create = async (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    const hash = await bcrypt.hash(req.body.password, 10);

    // Create a User
    const users = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hash
    };
    
    const emailExists = await db.sequelize.query(`SELECT username FROM USERS_INFOs WHERE username = '${req.body.username}'`);
    if (emailExists[0].length > 0){
       
      return res.status(400).json({ message: "Username already exists" });
    }else{
// Save user in the database
      User.create(users)
      .then(data => {

       
        statsDClient.increment('POST - Create user - /v1/user');
      
    
      res.status(201);
      console.log(data.username);
      logger.info("user created");
      res.send({id: data.id, first_name: data.first_name, last_name: data.last_name, username: data.username, account_created: data.createdAt, account_updated : data.updatedAt});
      })
      .catch(err => {
      res.status(500).send({
        message:
 err.message || "Some error occurred while creating the user."
      });
      });
      }

  };



// Find a single User with a id
exports.findOne = async (req, res) => {

  
  const authenticatedUsername = req.auth.user;
  console.log(req.auth.user);
  console.log(req.auth.password)
  
    // const {username, password } = req.body;
    username = req.auth.user;
    password = req.auth.password;
    const id = req.params.id;
  
    const [user] = await db.sequelize.query(`SELECT id,first_name, last_name, username,createdAt,updatedAt  FROM USERS_INFOs WHERE id = ${id}`);
    const [userp] = await db.sequelize.query(`SELECT username,password FROM USERS_INFOs WHERE id = ${id}`);
    console.log(userp[0])
    if(user[0] === undefined || userp === undefined){
      return res.status(400).json({ message: "Invalid id" });
    }else{
      
      if (userp[0].username !== username) return res.status(403).send({ message: 'Invalid credentials for current user' });
      const isPasswordValid = await bcrypt.compare(password,userp[0].password);
      if (!isPasswordValid) return res.status(401).send({ message: 'Invalid password' });
    }
    


    if(user[0]=== undefined){
      return res.status(400).json({ message: "Invalid id" });
    }else{
      logger.info("user found");
     
    statsDClient.increment(`GET - Fetch Account - /v1/user/:userId`);
 

res.send({ id: user[0].id, first_name: user[0].first_name, last_name: user[0].last_name, username: user[0].username, account_created: user[0].createdAt, account_updated : user[0].updatedAt  });
    }
    
  
  };


// Update a User identified by the id in the request
exports.update = async (req, res) => {

  
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    console.log(req.body.password);
    const hash = await bcrypt.hash(req.body.password, 10);
    const users = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: hash
    };
  
    console.log(req.body);
    username = req.auth.user;
    password = req.auth.password;
    const id = req.params.id;
    const [userp] = await db.sequelize.query(`SELECT username,password FROM USERS_INFOs WHERE id = ${id}`);
    console.log(userp[0].username);
    console.log(userp[0].password);
    if (userp[0].username !== username) return res.status(401).send({ message: 'User not found' });
    const isPasswordValid = await bcrypt.compare(password,userp[0].password);
  
    if (!isPasswordValid) 
    {
      return res.status(401).send({ message: 'Invalid password' });
}
    else if(req.body.first_name===""||req.body.last_name===""||req.body.username===""){
      return res.status(400).send({ message: 'No content on some value' });
      
    }else{
      User.update(users, {
        where: { id: id }
      })    .then(num => {
        if (num == 1) {
         
    statsDClient.increment(`PUT - Update Account - /v1/account/:accountId`);
  
          res.send({
            message: "User was updated successfully."
          });

          logger.info("user updated");
        } else {
request.status(400).res.send({
            message: `Cannot update USER with id=${id}. Maybe User was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
message: "Error updating User with id=" + id
        });
      });
    }

  

  };

// {
//     "first_name": "veer dodu",
//     "last_name" : "aaa",
//     "username": "veer234@gmail.com",
//     "password": "12345678"
//   }