DROP TABLE IF EXISTS users;
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  password VARCHAR,
  CONSTRAINT unique_email UNIQUE (email)
);

INSERT INTO users (email, first_name, last_name, password) VALUES
  ('maselloleandro@gmail.com', 'Leandro', 'Masello', '7c222fb2927d828af22f592134e8932480637c0d'),
  ('gguzelj@gmail.com', 'German', 'Guzelj', '7c222fb2927d828af22f592134e8932480637c0d'),
  ('apedrazzi@gmail.com', 'Andres', 'Pedrazzi', '7c222fb2927d828af22f592134e8932480637c0d');
