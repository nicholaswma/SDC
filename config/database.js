const pg = require('pg')

const config = {
  user: "postgres",
  password: "password1",
  host: "localhost",
  port: 5432,
  database: "hr-sdc"
}

const pool = new pg.Pool(config)

pool.on('connect', () => {
  console.log('connected to the Database');
});

module.exports = pool
