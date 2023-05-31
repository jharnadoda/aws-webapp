const db = require("../models");
const AWS = require('aws-sdk');
const IMAGE = db.images;
const bcrypt = require('bcrypt');
const { S3upload, S3delete } = require("../../S3service");
const logger = require("../config/logger");
const StatsD = require('node-statsd');

const statsDClient = new StatsD({
    host: 'localhost',
    port: 8125,
    prefix: 'CSYE6225_'
});

exports.create = async (req, res) => {
  
    const Pid = req.params.product_id;
    username = req.auth.user;
    password = req.auth.password;
    const file = req.files[0];
    const result=  await S3upload(file);

    //Getting UUID filename from S3 Bucket
    key = result.Key;
    const [dir , filename] = key.split("/")
    const Imagess = {
        product_id: Pid,
        file_name: filename,
        s3_bucket_path: result.Location, 
        KEY: result.Key
      };

    logger.info("Getting product info to create image");
    const [prod] = await db.sequelize.query(`SELECT * FROM PRODUCTS_INFOs WHERE id ="${Pid}"`);
    // console.log(prod[0]);
    if(prod[0]===undefined) return res.status(400).send();
    const [user] = await db.sequelize.query(`SELECT * FROM USERS_INFOs WHERE id = "${prod[0].owner_id}"`);
    const isPasswordValid = await bcrypt.compare(password,user[0].password);
    //console.log(user[0].username)
    if(user === undefined || prod ===undefined )
    return res.status(400).send();
    else if (user[0] === undefined || prod[0] === undefined){
      return res.status(400).send({message: "Either username or product id is invalid please check!!!!"})
    }else if(user[0].username !== username){
        return res.status(403).send({ message: 'this user does not have the access to this product' });
    } else if(!isPasswordValid){
        return res.status(401).send({ message: 'Invalid password' });
    }else{

        IMAGE.create(Imagess)
        .then(data => {
        res.send({Image_id: data.id, Product_id: data.product_id, file_name: data.file_name,date_created: data.createdAt , s3_bucket_path: data.s3_bucket_path, });
        
        statsDClient.increment('POST - Create Image - /v1/product/:product_id/image/');
        logger.info("Image successfully saved");
        })
        .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the product."
        });
        });
        
    }
 
}


exports.findall = async (req, res) => {
 
    const id = req.params.product_id;
    username = req.auth.user;
    password = req.auth.password;

    logger.info("Getting product info to find image");
    const [prod] = await db.sequelize.query(`SELECT * FROM PRODUCTS_INFOs WHERE id ="${id}"`);
    if(prod[0]===undefined) return res.status(400).send();
    const [user] = await db.sequelize.query(`SELECT * FROM USERS_INFOs WHERE id = "${prod[0].owner_id}"`);
    const isPasswordValid = await bcrypt.compare(password,user[0].password);
  
    const [product] = await db.sequelize.query(`SELECT * FROM IMAGES_INFOs WHERE product_id = '${id}'`);
    console.log(product);
      if(product === undefined){
          return res.status(400).json({ message: "Invalid id in image dataset" });
      } else if (user[0] === undefined || prod[0] === undefined){
        res.send({message: "Either username or product id is invalid please check!!!!"})
    }else if(user[0].username !== username){
        return res.status(403).send({ message: 'this user does not have the access to this product' });
    } else if(!isPasswordValid){
        return res.status(401).send({ message: 'Invalid password' });
    }else{
        res.send({ data: product});
        
    statsDClient.increment(`GET - Fetch Image - /v1/product/:product_id/image/`);
        logger.info("Images for this product found");
    }
  
  };


  exports.findone = async (req, res) => {
   
    const id = req.params.product_id;
    const iid = req.params.image_id;
    username = req.auth.user;
    password = req.auth.password;
    logger.info("Getting product info to find image");
    //if(id===undefined || iid===undefined) return res.status(400).json({ message: "Invalid id in image dataset" });
    const [prod] = await db.sequelize.query(`SELECT * FROM PRODUCTS_INFOs WHERE id ="${id}"`);
    //if(prod[0]===undefined) return res.status(400).send();
    const [user] = await db.sequelize.query(`SELECT * FROM USERS_INFOs WHERE id = "${prod[0].owner_id}"`);
    const isPasswordValid = await bcrypt.compare(password,user[0].password);
  
    const [product] = await db.sequelize.query(`SELECT * FROM IMAGES_INFOs WHERE product_id = '${id}' and id = '${iid}'`);
    console.log(product);
      if(product === undefined){
          return res.status(400).json({ message: "Invalid id in image dataset" });
      } else if (user[0] === undefined || prod[0] === undefined){
        res.send({message: "Either username or product id is invalid please check!!!!"})
    }else if(user[0].username !== username){
        return res.status(403).send({ message: 'this user does not have the access to this product' });
    } else if(!isPasswordValid){
        return res.status(401).send({ message: 'Invalid password' });
    }else if(product.length === 0){
      return res.status(400).send({ message:'product id does not exist'});
    } else{
        res.send({ Image_id: product[0].id, Product_id: product[0].product_id, file_name: product[0].file_name,date_created: product[0].createdAt , s3_bucket_path: product[0].s3_bucket_path });
        
  
    statsDClient.increment(`GET - Fetch Image - /v1//product/:product_id/image/${iid}`);
  
        logger.info("Image found!"); 
    }
  
  };


  exports.delete= async(req,res) => {
   
    const id = req.params.product_id;
    const iid = req.params.image_id;
    username = req.auth.user;
    password = req.auth.password;
    logger.info("Getting product info to delete image");
    const [prod] = await db.sequelize.query(`SELECT * FROM PRODUCTS_INFOs WHERE id ="${id}"`);
    if(prod[0] === undefined) return res.status(404).json({ message: "no product with product id found" });
    const [user] = await db.sequelize.query(`SELECT * FROM USERS_INFOs WHERE id = "${prod[0].owner_id}"`);
    const [image] = await db.sequelize.query(`SELECT * FROM IMAGES_INFOs WHERE id = "${iid}"`);
    const isPasswordValid = await bcrypt.compare(password,user[0].password);
    if(image[0] === undefined) return res.status(204).send();
    console.log("herrrrrrrre", image[0].KEY);
    PATH = image[0].KEY;
    result = await S3delete(PATH);

    const [product] = await db.sequelize.query(`SELECT * FROM IMAGES_INFOs WHERE product_id = '${id}' and id = '${iid}'`);
    console.log(product);
      if(product === undefined){
          return res.status(204).json({ message: "Invalid id in image dataset" });
      }else if(image===undefined){
        return res.status(204).json();
      } 
      
      else if (user[0] === undefined || prod[0] === undefined){
        res.send({message: "Either username or product id is invalid please check!!!!"})
    }else if(user[0].username !== username){
        return res.status(401).send({ message: 'this user does not have the access to this product' });
    } else if(!isPasswordValid){
        return res.status(403).send({ message: 'Invalid password' });
    }else{
        IMAGE.destroy({
            where: { id: iid }
          })
            .then(num => {
              if (num == 1) {
                res.send({
                  message: "Product was deleted successfully!"
                });
                
    statsDClient.increment(`DELETE - Delete Image - /v1/product/:product_id/image/:image_id`);


              } else {
                res.send({
                  message: `Cannot delete Product with id=${id}. Maybe Product was not found!`
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "Could not delete Product with id=" + id
              });
            });
    }
  
    };

