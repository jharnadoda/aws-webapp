require("dotenv").config();
console.log("reached server.js");
console.log(process.env.DB_HOST);
module.exports = {
  HOST: process.env.DB_HOST,// ||"csye6225.c5tgn3ng0qjc.us-east-1.rds.amazonaws.com",
  USER: process.env.DB_USER,// ||"csye6225",
  PASSWORD: process.env.DB_PASSWORD,// ||"Password123",
  DB: "csye6225",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};


// console.log("reached dbconfig.js");
// module.exports = {
//   HOST: "127.0.0.1",
//   USER: "ec2-user",
//   PASSWORD: "Password123@",
//   DB: "users_database",
//   dialect: "mysql",
//   pool: {
//     max: 5,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };
