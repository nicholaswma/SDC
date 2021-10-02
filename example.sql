DROP TABLE questions
DROP TABLE answers

CREATE TABLE questions (
    question_id SERIAL PRIMARY KEY,
    product_id int not null,
    question_body text not null,
    question_date DATE NOT NULL DEFAULT CURRENT_DATE,
    asker_name text not null,
    asker_email text not null,
    reported int not null,
    question_helpfulness int not null,
);

CREATE TABLE answers (
    answers_id SERIAL PRIMARY KEY,
    question_id int not null,
    body text not null,
    date_answered DATE NOT NULL DEFAULT CURRENT_DATE,
    answerer_name text not null,
    answerer_email text not null,
    reported int not null,
    answer_helpfulness int not null,
    constraint fk_questions
      foreign key (question_id)
      references questions(question_id)
);

CREATE TABLE photos (
  id SERIAL PRIMARY KEY,
  answer_id INT NOT NULL,
  url TEXT
)

 SELECT a.questions_id, a.answers_id, a.a_body, a.date_answered, a.answerer_name, a.answer_helpful, a.answer_reported, a.answerer_email,
      CASE
      WHEN count(p) = 0 THEN ARRAY[]::json[]
      ELSE ARRAY_AGG(p.photos)
      END AS photos
      INTO TABLE answers_and_photos
      FROM answers AS a LEFT JOIN (SELECT photos.answers_id, json_build_object('id', photos.photos_id, 'url', photos.url) AS photos
      FROM photos) AS p
      ON a.answers_id IN (p.answers_id)
      WHERE a.answer_reported IN (0)
      GROUP BY a.answers_id
      ORDER BY a.answer_helpful DESC

CREATE TABLE photos_url (
    id SERIAL PRIMARY KEY,
    answers_id int not null,
    url text not null
    constraint fk_questions
      foreign key (answers_id)
      references answers(answers_id)
);

COPY photos_url(answers_id, url)
FROM '/Users/nickey/Desktop/data/url.csv'
DELIMITER ','
CSV HEADER;

-- SELECT questions.questions_id AS question_id,
--                                     questions.questions_body AS question_body,
--                                     questions.date_written AS question_date,
--                                     questions.asker_name,
--                                     questions.questions_helpful AS question_helpfulness,
--                                     questions.questions_reported as reported,
--                                     json_object_agg(answers_and_photos.answers_id,
--                                       json_build_object(
--                                         'id', answers_and_photos.answers_id,
--                                         'body', answers_and_photos.a_body,
--                                         'date', answers_and_photos.date_answered,
--                                         'answerer_name', answers_and_photos.answerer_name,
--                                         'helpfulness', answers_and_photos.answer_helpful,
--                                         'photos', json_build_array(answers_and_photos.photos)
--                                       )) AS answers
--                                   FROM questions JOIN answers_and_photos ON questions.questions_id = answers_and_photos.questions_id
--                                   WHERE questions.product_id = ${productId}
--                                   GROUP BY questions.questions_id LIMIT ${count}`))