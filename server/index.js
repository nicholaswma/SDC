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
app.get('/loaderio-9bf6be8f004d55be99bb363e173805f9', (req, res) => {
  res.status(200).sendFile(path.join(__dirname + "/loaderio-67ab303709e345f5fda283506bb19c71.txt"));
})

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})
