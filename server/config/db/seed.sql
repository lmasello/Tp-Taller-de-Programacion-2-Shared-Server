DROP TABLE IF EXISTS users;
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  CONSTRAINT unique_email UNIQUE (email)
);

INSERT INTO users (email, first_name, last_name, password)
  VALUES ('maselloleandro@gmail.com', 'Leandro', 'Masello', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
INSERT INTO users (email, first_name, last_name, password)
  VALUES ('gguzelj@gmail.com', 'German', 'Guzelj', 'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3');
