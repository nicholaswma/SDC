DROP TABLE questions
DROP TABLE answers

create table questions (
    id serial primary key,
    product_id int not null,
    body text not null,
    date_written bigint,
    asker_name text not null,
    asker_email text not null,
    reported int not null,
    helpful int not null,
    constraint fk_questions,
      foreign key (product_id)
      references products(id)
);

create table answers (
    id serial primary key,
    product_id int not null,
    body text not null,
    date_written bigint,
    answerer_name text not null,
    answerer_email text not null,
    reported int not null,
    helpful int not null,
    constraint fk_questions
      foreign key (product_id)
      references questions(product_id)
);
