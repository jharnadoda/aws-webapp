const {
  json
} = require("body-parser");
const uuid = require("uuid").v4;
module.exports = app => {
  const users = require("../controllers/user.controller.js");
  const products = require("../controllers/product.controller.js")
  const images = require("../controllers/image.controller")
  var router = require("express").Router();
  const bcrypt = require('bcrypt');
  const db = require("../models");
  const basicAuth = require('express-basic-auth');
  const multer = require('multer');


  const getUserFromDb = username => {
    return new Promise((resolve, reject) => {
      db.sequelize.query(
        'SELECT * FROM USERS_INFOs WHERE username = "?"', [username],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results[0]);
          }
        }
      );
    });
  };

  const comparePassword = (plainTextPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
      bcrypt.compare(plainTextPassword, hashedPassword, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };



  router.post("/user/", users.create);

  router.get("/user/:id", basicAuth({
    authorizer: async (username, password) => {

      const user = await getUserFromDb(username);
      //console.log(user[0][0].password);

      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user[0][0].password);
      return passwordMatch;

    },
    challenge: true
  }), users.findOne);


  router.put("/user/:id", basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }), users.update);



  //PRODUCTS
  //create new product
  router.post("/product/", basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }), products.create);



  router.put("/product/:id", basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }), products.update);

  router.patch("/product/:id", basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }), products.updatePatch);


  router.get("/product/:id", basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }), products.findOne);

  router.delete("/product/:id", basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }), products.delete);



  //  const storage  = multer.diskStorage({
  //   destination: (req, file,cb)=>{
  //     cb(null,"uploads/");
  //   },
  //   filename:(req,file,cb)=>{
  //     const {originalname} = file;
  //     cb(null, `${uuid()}-${originalname}`);
  //   },
  // });
  const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "image") {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
  };
  const storage = multer.memoryStorage();
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 1000000000,
      files: 2
    },
  });
  // router.post('/product/:product_id/image',upload.single("file") ,images.create)
  router.post('/product/:product_id/image', basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }), upload.array("file"), images.create);

  router.get('/product/:product_id/image',basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }), images.findall);

  router.get('/product/:product_id/image/:image_id',basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }),images.findone )

  router.delete('/product/:product_id/image/:image_id',basicAuth({
    authorizer: async (username, password) => {
      const user = await getUserFromDb(username);
      if (!user) {
        return false;
      }
      const passwordMatch = await comparePassword(password, user.password);
      return passwordMatch;

    },
    challenge: true
  }),images.delete )


  app.use('/v1', router);
};