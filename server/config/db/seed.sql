DROP TABLE IF EXISTS user_contacts;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL,
  firstName VARCHAR NOT NULL,
  lastName VARCHAR NOT NULL,
  password VARCHAR,
  created_at timestamp,
  updated_at timestamp,
  CONSTRAINT unique_email UNIQUE (email)
);

CREATE TABLE user_contacts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  friend_id INTEGER NOT NULL,
  created_at timestamp,
  updated_at timestamp,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id),
  CONSTRAINT unique_pair UNIQUE (user_id, friend_id)
);

CREATE INDEX index_user_ids
ON users (id);

INSERT INTO users (email, firstName, lastName, password) VALUES
  ('maselloleandro@gmail.com', 'Leandro', 'Masello', '7c222fb2927d828af22f592134e8932480637c0d'),
  ('gguzelj@gmail.com', 'German', 'Guzelj', '7c222fb2927d828af22f592134e8932480637c0d'),
  ('apedrazzi@gmail.com', 'Andres', 'Pedrazzi', '7c222fb2927d828af22f592134e8932480637c0d');

INSERT INTO user_contacts (user_id, friend_id) VALUES
  (2, 3),
  (1, 2);
