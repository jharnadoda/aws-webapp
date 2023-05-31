console.log("i reached the index.js file 2jkcbuydh");
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");


// const sequelize = new Sequelize('mysql://root:password@localhost:3000/users_database2',{
//   pool: {
//         max: dbConfig.pool.max,
//         min: dbConfig.pool.min,
//         acquire: dbConfig.pool.acquire,
//         idle: dbConfig.pool.idle
//       }
// });
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  setTimeout:60000,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
console.log(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD,dbConfig.HOST,dbConfig.dialect,)

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.products = require("./product.model.js")(sequelize, Sequelize);
db.images = require("./image.model.js")(sequelize, Sequelize);


module.exports = db;

// // Create a connection to the database
// const connection = mysql.createConnection({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB
// });
// // open the MySQL connection
// connection.connect(error => {
//   if (error) throw error;
//   // console.log("Successfully connected to the database.");
//   // console.log(dbConfig.DB);
// });

// module.exports = connection;