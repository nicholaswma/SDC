const sequelize = require('sequelize');
const db = require('../config/database');

const Answers = db.define('answer', {
  product_id: {
    type: sequelize.INTEGER,
    allowNull: false
  },
  body: {
    type: sequelize.STRING,
    allowNull: false
  },
  date_written: {
    type: sequelize.BIGINT,
    allowNull: false
  },
  answerer_name: {
    type: sequelize.TEXT,
    allowNull: false
  },
  answerer_email:  {
    type: sequelize.TEXT,
    allowNull: false
  },
  reported:  {
    type: sequelize.INTEGER,
    allowNull: false
  },
  helpful:  {
    type: sequelize.INTEGER,
    allowNull: false
  }
})

module.exports = Answers
