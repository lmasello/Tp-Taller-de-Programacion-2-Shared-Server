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
    }
  }, {
    underscored: true
  });
  return Song;
};
