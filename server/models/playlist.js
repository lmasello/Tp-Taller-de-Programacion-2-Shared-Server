const Sequelize = require('sequelize');

exports.getModel = (db) => {
  var Playlist = db.define('playlist', {
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
    description: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    underscored: true,
    associations: true
  });
  return Playlist;
};
