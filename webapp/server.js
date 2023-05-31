require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const logger= require("./app/config/logger");
const StatsD = require('node-statsd');

// statsD - init
const statsDClient = new StatsD({
  host: 'localhost',
  port: 8125,
  prefix: 'CSYE6225_'
});

var corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
const db = require("./app/models");
// db.sequelize.sync({ force: true }).then(() => {
//     console.log("Drop and re-sync db.");
//   });
db.sequelize.sync({ force: true })
  .then(() => {
    logger.info("Synced db.");
  })
  .catch((err) => {
    logger.info("Failed to sync db: " + err.message);
  });

// simple route
app.get("/healthz", (req, res) => {
  res.json();
    statsDClient.increment('GET /healthz');
  logger.info("/healthz executed successfully")

});
// app.get("/health", (req, res) => {
//   res.json();
//   logger.info("/health executed successfully")

// });

require("./app/routes/user.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}.`);
});
module.exports = app;