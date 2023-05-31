module.exports = (sequelize, Sequelize) => {
  const { DataTypes } = require('sequelize');
    const IMAGES = sequelize.define("IMAGES_INFOs", {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      s3_bucket_path:{
        type: DataTypes.STRING
      },
      KEY:{
        type: DataTypes.STRING
      } 


    });
  
    return IMAGES;
  };