CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR
);

INSERT INTO users (email, first_name, last_name)
  VALUES ('maselloleandro@gmail.com', 'Leandro', 'Masello');
INSERT INTO users (email, first_name, last_name)
  VALUES ('gguzelj@gmail.com', 'German', 'Guzelj');
