// const sequelize = require('sequelize');
const db = require('../config/database');

// const Question = db.define('question', {
//   product_id: {
//     type: sequelize.INTEGER,
//     allowNull: false
//   },
//   body: {
//     type: sequelize.STRING,
//     allowNull: false
//   },
//   date_written: {
//     type: sequelize.BIGINT,
//     allowNull: false
//   },
//   asker_name: {
//     type: sequelize.TEXT,
//     allowNull: false
//   },
//   asker_email:  {
//     type: sequelize.TEXT,
//     allowNull: false
//   },
//   reported:  {
//     type: sequelize.INTEGER,
//     allowNull: false
//   },
//   helpful:  {
//     type: sequelize.INTEGER,
//     allowNull: false
//   }
// })

// module.exports = Question

// // create table questions (
// //   id serial primary key,
// //   product_id int not null,
// //   body text not null,
// //   date_written bigint,
// //   asker_name text not null,
// //   asker_email text not null,
// //   reported int not null,
// //   helpful int not null
// // );

module.exports = {
  test: function async (callback) {
    try {
      const result = await (db.query(`SELECT photos.answers_id, string_agg(url, ', ') FROM photos GROUP BY photos.answers_id`))
      callback(err, results);
    } catch (err) {
    }
  }
}