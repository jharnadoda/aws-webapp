const db = require("../models");
const Product = db.products;
const bcrypt = require('bcrypt');
const logger = require("../config/logger");
const StatsD = require('node-statsd');



const statsDClient = new StatsD({
    host: 'localhost',
    port: 8125,
    prefix: 'CSYE6225_'
});

// create and save new product
exports.create = async (req, res) => {
  
    // Validate request
    if (!req.body) {
res.status(204).send({
        message: "Content can not be empty!"
      });
    }
    //const hash = await bcrypt.hash(req.body.password, 10);
    // Create a User
    
    logger.info("Getting info to create product");
    console.log(req.auth.user);
    console.log(req.auth.password);
    username = req.auth.user;
    password = req.auth.password;
    const [user] = await db.sequelize.query(`SELECT *  FROM USERS_INFOs WHERE username = "${username}"`);
    console.log(user);
    if(user.length === 0){
      return res.status(400).send({ message: 'User not found' });
    }
    const products = {
        name: req.body.name,
        description: req.body.description,
        sku: req.body.sku,
        manufacturer: req.body.manufacturer,
        quantity: req.body.quantity,
        owner_id : user[0].id
      };
 if (user[0].username !== username) return res.status(400).send({ message: 'User not found' });
    const [skuExists] = await db.sequelize.query(`SELECT sku FROM PRODUCTS_INFOs where sku = "${req.body.sku}"`);
    console.log(skuExists.length)
    const isPasswordValid = await bcrypt.compare(password,user[0].password);
    
    if (!isPasswordValid) {
        return res.status(401).send({ message: 'Invalid password' });
 }

    else if(req.body.sku === undefined || req.body.name === undefined|| req.body.description === undefined|| req.body.manufacturer=== undefined|| req.body.quantity === undefined){
      return res.status(400).send({ message: 'Bad json format given' });
    }
    else if(req.body.sku === "" || req.body.name === ""|| req.body.description === ""|| req.body.manufacturer=== ""|| req.body.quantity === ""){
      return res.status(400).send({ message: 'No content on some value' });
    }
    else if(req.body.quantity<1||req.body.quantity>100)
    {return res.status(400).json({ message: "quantity invalid" });}
    else if(skuExists.length > 0){
        return res.status(400).json({ message: "sku already exists" });
    }
    else{
        Product.create(products)
        .then(data => {
        res.send(data);
        
        statsDClient.increment('POST - Create product - /v1/product');
   
        logger.info("product created");
        })
        .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the product."
        });
        });
    }
    




    
}



exports.update = async (req, res) => {
  
    // Validate Request
    if (!req.body) {
      res.status(204).send({
        message: "Content can not be empty!"
      });
    }
    //const hash = await bcrypt.hash(req.body.password, 10);

  
    console.log(req.body);
    username = req.auth.user;
    password = req.auth.password;
    const id = req.params.id;
    const [user] = await db.sequelize.query(`SELECT * FROM USERS_INFOs WHERE username = "${username}"`);
    const [prod] = await db.sequelize.query(`SELECT * FROM PRODUCTS_INFOs WHERE id ="${id}"`)
    console.log("here",user[0].username);
    console.log("here2",user[0].password);
    console.log(prod[0]);
    const products = {
        name: req.body.name,
        description: req.body.description,
        sku: req.body.sku,
        manufacturer: req.body.manufacturer,
        quantity: req.body.quantity,
        owner_id : user[0].id
      };
      if (user[0].username !== username) return res.status(401).send({ message: 'User not found' });

      const isPasswordValid = await bcrypt.compare(password,user[0].password);

  
    if (!isPasswordValid) 
    {
      return res.status(403).send({ message: 'Invalid password' });
    }else if (prod[0].owner_id !== user[0].id){
        return res.status(403).send({ message: 'This User does not have permission to update this product' });
    }else if(req.body.sku === undefined || req.body.name === undefined|| req.body.description === undefined|| req.body.manufacturer=== undefined|| req.body.quantity === undefined){
        return res.status(400).send({ message: 'Bad json format given' });
    }else if(req.body.sku === "" || req.body.name === ""|| req.body.description === ""|| req.body.manufacturer=== ""|| req.body.quantity === ""){
        return res.status(400).send({ message: 'No content on some value' });
} 
    else if(req.body.quantity<1||req.body.quantity>100)
    {return res.status(400).json({ message: "quantity invalid" });}
    else if(req.body.sku){
        const [skuExists] = await db.sequelize.query(`SELECT sku FROM PRODUCTS_INFOs where sku = "${req.body.sku}"`);
        console.log(skuExists.length)
        if(skuExists.length > 0){
            return res.status(400).send({ message: 'Sku already exist' });
        }else{
            Product.update(products, {
                where: { id: id }
              })    .then(num => {
                if (num == 1) {
                  res.send({
                    message: "Product was updated successfully."
                  });
                  
                  statsDClient.increment(`PUT - Update product - /v1/product/:productId`);

                
                  logger.info("product updated");
                } else {
                  res.send({
                    message: `Cannot update Product with id=${id}. Maybe product was not found or req.body is empty!`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating Product with id=" + id
                });
              });
        }

    }
    else
    {
        Product.update(products, {
            where: { id: id }
          })    .then(num => {
            if (num == 1) {
              res.send({
                message: "User was updated successfully."
              });
              
                  statsDClient.increment(`PUT - Update product - /v1/product/:productId`);
              
            } else {
              res.send({
                message: `Cannot update Product with id=${id}. Maybe product was not found or req.body is empty!`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Error updating Product with id=" + id
            });
          });
    }
  };

  exports.updatePatch = async (req, res) => {
    
    // Validate Request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    username = req.auth.user;
    password = req.auth.password;
    const id = req.params.id;
    const [user] = await db.sequelize.query(`SELECT * FROM USERS_INFOs WHERE username = "${username}"`);
    const [prod] = await db.sequelize.query(`SELECT * FROM PRODUCTS_INFOs WHERE id ="${id}"`)
    console.log("here",user[0].username);
    console.log("here2",user[0].password);
    console.log(prod[0]);
    // if(prod[0].name === req.body.name || prod[0].description === req.body.description){
    //     console.log("Same")
    // }else{
    //     console.log("Not Same")
    // }
    // const products = {
    //     name: req.body.name,
    //     description: req.body.description,
    //     sku: req.body.sku,
    //     manufacturer: req.body.manufacturer,
    //     quantity: req.body.quantity,
    //     owner_id : user[0].id
    //   };
      if (user[0].username !== username) return res.status(401).send({ message: 'User not found' });

      const isPasswordValid = await bcrypt.compare(password,user[0].password);
    
      const updates = req.body;
      console.log(updates)

  
    if (!isPasswordValid) 
    {
      return res.status(401).send({ message: 'Invalid password' });
    }else if (prod[0].owner_id !== user[0].id){
        return res.status(403).send({ message: 'This User does not have permission to update this product' });
 }
    else if(req.body.quantity<1||req.body.quantity>100)
    {return res.status(400).json({ message: "quantity invalid" });}
    else if(req.body.sku){
        const [skuExists] = await db.sequelize.query(`SELECT sku FROM PRODUCTS_INFOs where sku = "${req.body.sku}"`);
        console.log(skuExists.length)
        if(skuExists.length >0){
            return res.status(400).json({ message: "sku already exists" });
        }else{
            Product.update(updates,{
                where: { id: id }
            })
                .then(num => {
                if (num == 1) {
                  res.send({
                    message: "User was updated successfully."
                  });
                  
    statsDClient.increment(`PUT - Update product - /v1/product/:productId`);
 
                } else {
                  res.send({
                    message: `Cannot update Product with id=${id}. Maybe product was not found or req.body is empty!`
                  });
                }
              })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating Product with id=" + id
                });
              });
        }
        
    }
    else
    {
        Product.update(updates,{
            where: { id: id }
        })
            .then(num => {
            if (num == 1) {
              res.send({
                message: "User was updated successfully."
              });
              
    statsDClient.increment(`PUT - Update product - /v1/product/:productId`);
   
            } else {
              res.send({
                message: `Cannot update Product with id=${id}. Maybe product was not found or req.body is empty!`
              });
            }
          })
          .catch(err => {
            res.status(500).send({
              message: "Error updating Product with id=" + id
            });
          });
    }
  };





  exports.findOne = async (req, res) => {
    console.log(req.auth.user);
    console.log(req.auth.password)
    
      // const {username, password } = req.body;
      logger.info("Getting info to find product");
      username = req.auth.user;
      password = req.auth.password;  
      const id = req.params.id;
      const [product] = await db.sequelize.query(`SELECT * FROM PRODUCTS_INFOs WHERE id = ${id}`);

      const [userp] = await db.sequelize.query(`SELECT username,password FROM USERS_INFOs WHERE id = ${product[0].owner_id}`);
      console.log(userp[0])
      const isPasswordValid = await bcrypt.compare(password,userp[0].password);
        if(product[0] === undefined){
            return res.status(400).json({ message: "Invalid id" });
        }else if(userp[0].username !== username){
          return res.status(401).send({ message: 'User not found' });
        }else if(!isPasswordValid){
          return res.status(401).send({ message: 'Invalid password' });
        }
        else{
            res.send({ data: product[0]  });
            
    statsDClient.increment(`GET - Fetch product - v1/product/:product_id/image/:image_id`);

            logger.info("Product found!");
        }
    
    };


    exports.delete= async(req,res) => {
      
        const id = req.params.id;
        username = req.auth.user;
        password = req.auth.password;

        const [user] = await db.sequelize.query(`SELECT * FROM USERS_INFOs WHERE username = "${username}"`);
        const [prod] = await db.sequelize.query(`SELECT * FROM PRODUCTS_INFOs WHERE id ="${id}"`)
        if (user[0].username !== username) return res.status(401).send({ message: 'User not found' });
        const isPasswordValid = await bcrypt.compare(password,user[0].password);
        console.log(prod[0])
        if(!isPasswordValid){
            return res.status(401).send({ message: 'Invalid password' });
        }else if(prod[0] === undefined){
            return res.status(401).send({ message: `Cannot delete Product with id=${id}. Maybe Product was not found!` });
        }
        else if(prod[0].owner_id !== user[0].id){
            return res.status(403).send({ message: 'This User does not have permission to delete this product' });
        }
        else{
            Product.destroy({
                where: { id: id }
              })
                .then(num => {
                  if (num == 1) {
                    res.send({
                      message: "Product was deleted successfully!"
                    });
                    
    statsDClient.increment(`DELETE - Delete product - /v1/product/:productId`);
   
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


    }


// {
//     "name": null,
//     "description": null,
//     "sku": null,
//     "manufacturer": null,
//     "quantity": 1
//   }
