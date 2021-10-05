const express = require('express');
const app = express();
const path = require('path');
const env = path.resolve('env.env');
const db = require('../config/database')
const router = require('../router/routes')
const morgan = require('morgan')

app.use(express.json())
app.use(morgan())

require('dotenv').config({path: env})

app.use('/qa', router);

// loader.ioconfig
app.get('/67ab303709e345f5fda283506bb19c71', (req, res) => {
  res.status(200).sendFiles(path.join(__dirname + "/loaderio-67ab303709e345f5fda283506bb19c71.txt"));
})

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})
