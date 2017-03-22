DROP DATABASE IF EXISTS "music-io-shared-server_development";
CREATE DATABASE "music-io-shared-server_development" OWNER "music-io-shared-server";

\c "music-io-shared-server_development";

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  email VARCHAR,
  first_name VARCHAR,
  last_name VARCHAR
);

INSERT INTO users (email, first_name, last_name)
  VALUES ('maselloleandro@gmail.com', 'Leandro', 'Masello');
