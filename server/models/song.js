const Sequelize = require('sequelize');

exports.getModel = (db) => {
  var Song = db.define('song', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    duration: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    albumId: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    underscored: true
  });
  return Song;
};
