module.exports = (sequelize, Sequelize) => {
    const PRODUCTS = sequelize.define("PRODUCTS_INFOs", {
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      sku: {
        type: Sequelize.STRING
      },
      manufacturer:{
        type: Sequelize.STRING
      },
      quantity:{
        type: Sequelize.INTEGER
      },
      owner_id:{
        type: Sequelize.INTEGER
      }
    });
  
    return PRODUCTS;
  };


  // {
  //   "name": null,
  //   "description": null,
  //   "sku": null,
  //   "manufacturer": null,
  //   "quantity": 1
  // }