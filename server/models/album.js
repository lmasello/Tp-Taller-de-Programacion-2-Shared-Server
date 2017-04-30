const Sequelize = require('sequelize');

exports.getModel = (db) => {
  var Album = db.define('album', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false
    },
    release_date: {
      type: Sequelize.DATEONLY,
      allowNull: false
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    },
    genres: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    }
  }, {
    underscored: true,
    associations: true
  });
  return Album;
};
