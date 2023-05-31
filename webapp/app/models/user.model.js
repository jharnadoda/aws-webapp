

module.exports = (sequelize, Sequelize) => {
  const USERS = sequelize.define("USERS_INFOs", {
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    username: {
      type: Sequelize.STRING
    },
    password:{
      type: Sequelize.STRING
    }
  });

  return USERS;
};

// {
//   "first_name": "jharna",
//   "last_name" : "Singh",
//   "username": "jharna123@gmail.com",
//   "password": "12345678"
// }