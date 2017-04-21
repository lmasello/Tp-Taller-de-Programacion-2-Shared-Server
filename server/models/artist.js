const Sequelize = require('sequelize');

exports.getModel = (db) => {
  var Artist = db.define('artist', {
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
    },
    genres: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: false
    },
    images: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true
    },
    popularity: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    underscored: true
  });
  return Artist;
};
