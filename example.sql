DROP TABLE answers;
DROP TABLE questions;
DROP TABLE photos;
DROP TABLE answers_and_photos


CREATE TABLE questions (
    questions_id SERIAL PRIMARY KEY,
    product_id int not null,
    questions_body text not null,
    date_written bigint NOT NULL,
    asker_name text not null,
    asker_email text not null,
    questions_reported int not null,
    questions_helpful int not null
);

COPY questions (questions_id, product_id, questions_body, date_written, asker_name, asker_email, questions_reported, questions_helpful)
FROM '/Users/nickey/Desktop/data/answers.csv'
DELIMITER ','
CSV HEADER;


CREATE TABLE answers (
    answers_id SERIAL PRIMARY KEY,
    questions_id int not null,
    a_body text not null,
    date_answered bigint NOT NULL,
    answerer_name text not null,
    answerer_email text not null,
    answer_reported int not null,
    answer_helpful int not null,
    constraint fk_questions
      foreign key (questions_id)
      references questions(questions_id)
);

COPY answers (answers_id, questions_id, a_body, date_answered, answerer_name, answerer_email, answer_reported, answer_helpful)
FROM '/Users/nickey/Desktop/data/answers.csv'
DELIMITER ','
CSV HEADER;

CREATE TABLE photos (
  photos_id SERIAL PRIMARY KEY,
  answers_id INT NOT NULL,
  url TEXT
);

COPY photos (photos_id, answers_id, url)
FROM '/Users/nickey/Desktop/data/answers_photos.csv'
DELIMITER ','
CSV HEADER;

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

CREATE INDEX questions_id ON questions(questions_id);
CREATE INDEX questions_body ON questions(questions_body);
CREATE INDEX product_id ON questions(product_id);


CREATE INDEX answers_id ON answers_and_photos(answers_id);
CREATE INDEX a_body ON answers_and_photos(a_body);
CREATE INDEX questions_id_aap ON answers_and_photos(questions_id);


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