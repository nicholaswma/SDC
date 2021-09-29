const router = require('express').Router()
const Question = require('../models/Question');
const Answers = require('../models/Answers')


router.get('/', (req, res) => {
  Question.findAll({
    where: {id: 2000}
  })
    .then(question => {
      res.send(question).status(200)
    })
})

module.exports = router