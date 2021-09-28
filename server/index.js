const express = require('express');
const app = express()
require('dotenv').config()

//testingg

app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}`)
})