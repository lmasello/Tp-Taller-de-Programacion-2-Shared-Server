DROP TABLE IF EXISTS users;
CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  password VARCHAR,
  CONSTRAINT unique_email UNIQUE (email)
);

DROP TABLE IF EXISTS user_contacts;
CREATE TABLE user_contacts (
  ID SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id),
  CONSTRAINT unique_pair UNIQUE (user_id, friend_id)
);

CREATE INDEX index_user_ids
ON users (id);

INSERT INTO users (email, first_name, last_name, password) VALUES
  ('maselloleandro@gmail.com', 'Leandro', 'Masello', '7c222fb2927d828af22f592134e8932480637c0d'),
  ('gguzelj@gmail.com', 'German', 'Guzelj', '7c222fb2927d828af22f592134e8932480637c0d'),
  ('apedrazzi@gmail.com', 'Andres', 'Pedrazzi', '7c222fb2927d828af22f592134e8932480637c0d');

INSERT INTO user_contacts (user_id, friend_id) VALUES
  (2, 3),
  (1, 2);
