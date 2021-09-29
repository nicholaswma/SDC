const { Sequelize } = require('sequelize')

module.exports = new Sequelize('hr-sdc', 'postgres', 'password1', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: false
  }
});
