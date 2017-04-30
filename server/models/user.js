const Sequelize = require('sequelize');

exports.getModel = (db) => {
  var User = db.define('user', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    userName: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false
    },
    birthdate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    }
  }, {
    // freezeTableName: true,
    underscored: true
  });
  User.belongsToMany(User, { as: 'Friend', through: 'user_contacts', foreignKey: 'friend_id' });
  User.belongsToMany(User, { as: 'User', through: 'user_contacts', foreignKey: 'user_id' });
  return User;
};
