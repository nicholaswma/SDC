const router = require('express').Router();
// const Question = require('../models/Question');
// const Answers = require('../models/Answers');
const db = require('../config/database')

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
  }
})


router.get('/questions/:question_id/answers', async (req, res) => {
  const id = req.params.question_id
  try {
    res.send(id)
  } catch (err) {
    console.log(err)
  }
})

module.exports = router