const express = require('express');
const app = express();
const path = require('path');
const env = path.resolve('env.env');
const db = require('../config/database')
const router = require('../router/routes')
const morgan = require('morgan')

app.use(express.json())
app.use(morgan())
db.authenticate()
  .then(() => console.log('connected'))
  .catch(() => console.log('no'))

require('dotenv').config({path: env})

app.get('/', router)


app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})
