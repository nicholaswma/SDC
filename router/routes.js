const router = require('express').Router();
// const Question = require('../models/Question');
// const Answers = require('../models/Answers');
const db = require('../config/database')

//get all questions and answers for a specific product
router.get('/questions', async (req, res) => {
  const productId = req.query.product_id;
  const count = req.query.count || 5;
  try {
    const result = await(db.query(`SELECT questions.questions_id AS question_id,
                                    questions.questions_body AS question_body,
                                    questions.date_written AS question_date,
                                    questions.asker_name,
                                    questions.questions_helpful AS question_helpfulness,
                                    questions.questions_reported as reported,
                                    json_object_agg(answers.answers_id,
                                      json_build_object(
                                        'id', answers.answers_id,
                                        'body', answers.a_body,
                                        'date', answers.date_answered,
                                        'answerer_name', answers.answerer_name,
                                        'helpfulness', answers.answer_helpful,
                                        'photos', json_build_array(photos.url)
                                      )) AS answers
                                  FROM questions JOIN answers ON questions.product_id = ${productId} AND questions.questions_id = answers.questions_id
                                  LEFT JOIN photos ON answers.answers_id = photos.answers_id
                                  GROUP BY questions.questions_id LIMIT ${count}`))
    result.rows.map((ele) => {
      ele.question_date = new Date (parseInt(ele.question_date))
      var arr = Object.keys(ele.answers);
      if (ele.reported > 0) {
        ele.reported = true
      } else {
        ele.reported = false
      }
      arr.forEach(num => {
        ele.answers[num].date = new Date (parseInt(ele.answers[num].date))
        if (ele.answers[num].photos[0] === null) {
          ele.answers[num].photos = [];
          }
       })
      })
    res.send({product_id: parseInt(productId), results: result.rows})
  } catch (err) {
    console.log(err)
    res.send('err').status(400)
  }
})

//get all answers for a specific question
router.get('/questions/:question_id/answers', async (req, res) => {
  const id = req.params.question_id
  const page = req.query.page || 1;
  const count = parseInt(req.query.count) || 5;
  try {
    const result = await(db.query(`SELECT answers.answers_id as answer_id,
                                    answers.a_body as body,
                                    answers.date_answered as date,
                                    answers.answerer_name as answerer_name,
                                    answers.answer_helpful as helpfulness,
                                    json_build_array(photos.url) as photos
                                    FROM answers LEFT JOIN photos ON answers.answers_id = photos.answers_id
                                    WHERE answers.questions_id = ${id}`))
    result.rows.map((ele) => {
      ele.date = new Date (parseInt(ele.date))
      if (ele.photos[0] === null) {
        ele.photos = [];
      }
    })
    res.send({question: id,
              page: page,
              count: count,
              results: result.rows})
  } catch (err) {
    console.log(err)
  }
})

//Add a question
router.post('/questions', async (req, res) => {
  try {
    const body = req.body.body
    const name = req.body.name
    const email = req.body.email
    const productId = req.body.product_id;
    const date = Date.now();
    let next = [];
    var nextId = await (db.query(`SELECT questions_id as i FROM questions ORDER BY questions_id DESC LIMIT 1`))
    await next.push(nextId.rows[0].i + 1)
    await(db.query(`INSERT INTO questions
                  (questions_id, date_written, questions_body, product_id, asker_name, asker_email, questions_reported, questions_helpful)
                  VALUES (${next[0]}, ${date}, '${body}', ${productId}, '${name}', '${email}', 0, 0);`))
    res.send('Questions Received').status(200)
  } catch (err) {
    console.log(err)
    res.status(404)
  }
})

// Add an answer
router.post('/questions/:question_id/answers', async (req, res) => {
  try {
    const id = req.params.question_id
    const body = req.body.body
    const name = req.body.name
    const email = req.body.email
    const date = Date.now();
    let next = [];
    var nextId = await (db.query(`SELECT answers_id as i FROM answers ORDER BY answers_id DESC LIMIT 1`))
    await next.push(nextId.rows[0].i + 1)
    await(db.query(`INSERT INTO answers
                  (answers_id, date_answered, a_body, questions_id, answerer_name, answerer_email, answer_reported, answer_helpful)
                  VALUES (${next[0]}, ${date}, '${body}', ${id}, '${name}', '${email}', 0, 0);`))
    res.send('Answer Received').status(200)
  } catch (err) {
    console.log(err)
    res.status(404)
  }
})

// Mark Question as helpful
router.put('/questions/:question_id/helpful', async (req, res) => {
  const id = req.params.question_id
  try {
    await(db.query(`UPDATE questions SET questions_helpful = questions_helpful + 1 WHERE questions_id = ${id}`))
    res.send('Questions marked as helpful').status(204)
  } catch (err){
    console.log(err)
    res.status(400).send(err)
  }
})
//Report Question
router.put('/questions/:question_id/report', async (req, res) => {
  const id = req.params.question_id
  try {
    await(db.query(`UPDATE questions SET questions_reported = 1 WHERE questions_id = ${id}`))
    res.send('Question Reported').status(204)
  } catch (err){
    console.log(err)
    res.status(400).send(err)
  }
})

//Mark Answer as helpful
router.put('/answers/:answer_id/helpful', async (req, res) => {
  const id = req.params.answer_id
  try {
    await(db.query(`UPDATE answers SET answer_helpful = answer_helpful + 1 WHERE answers_id = ${id}`))
    res.send('Answer marked as helpful').status(204)
  } catch (err){
    console.log(err)
    res.status(400).send(err)
  }
})

//Report Answer
router.put('/answers/:answer_id/report', async (req, res) => {
  const id = req.params.answer_id
  try {
    await(db.query(`UPDATE answers SET answer_reported = 1 WHERE answers_id = ${id}`))
    res.send('Answer Reported').status(204)
  } catch (err){
    console.log(err)
    res.status(400).send(err)
  }
})


module.exports = router