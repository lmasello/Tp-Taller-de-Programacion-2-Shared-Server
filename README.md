# tp-taller-de-programacion-2-Shared-Server
Shared server repository for the semestral project of the subject 'Taller de Programación II'
of the University of Buenos Aires which consist of doing an application similar to Spotify.
This application is called 'music-io'.

## Build status
[![BuildStatus](https://travis-ci.org/lmasello/Tp-Taller-de-Programacion-2-Shared-Server.svg?branch=development)](https://travis-ci.org/lmasello/Tp-Taller-de-Programacion-2-Shared-Server)
[![codecov](https://codecov.io/gh/lmasello/Tp-Taller-de-Programacion-2-Shared-Server/branch/development/graph/badge.svg)](https://codecov.io/gh/lmasello/Tp-Taller-de-Programacion-2-Shared-Server)


## Heroku instance
https://music-io-shared-server.herokuapp.com/

## Run docker container
Note: Execute the following commands at the root of the project.
### Running the application
 - Run the docker image linked to a PostgreSQL database
```bash
docker-compose up
```
### What is the ip of the server?
```bash
docker inspect tptallerdeprogramacion2sharedserver_shared-server_1
```
And look for NetworkSettings->Networks->bridge->IPAddress

### Want to access the data base container?
- Get the available networks
```bash
docker network list
```
- Supose the network for docker compose is [network]
```bash
docker run -it --rm --network=[network] postgres bash
```
### Env file
By using Docker and Docker Compose, you can check your local development environment setup into source code control. To handle sensitive credentials, create a .env environment file with your credentials and reference it within your Compose YAML. Your .env should be added to your .gitignore and .dockerignore files so it is not checked into source code control or included in your Docker image, respectively.
```yaml
services:
  web:
    env_file: .env
```
You have to set the following variables in a file called `.docker-env`:
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB
- DATABASE_URL

## Deploy to Heroku
Execute the following commands at the root of the project:
 - Add the heroku remote
```bash
heroku git:remote -a music-io-shared-server
```
 - Deploy changes
```bash
git push heroku development:master
```

Connect to heroku postgres
`heroku pg:psql postgresql-rigid-81805 --app music-io-shared-server`

For further information see: https://devcenter.heroku.com/articles/git

## Logger
In order to use logs during run time, we use the 'Winston' library
(https://github.com/winstonjs/winston).
Basically, you have to call `var logger = require('./config/logger/winston.js');` in your js file
and then call it in the following ways:
```
logger.error('Error message');
logger.warn('Warn message');
logger.info('Info message');
logger.debug('Debug message');
```
Note that the error and warn messages will be saved to the file 'logfile.log' whereas all kinds of
messages (error, warn, info and debug) will appear on the console.

## Specs
Execute the this command at the root of the project to run all tests:
```
npm test
```
## Database - PostgreSQL
Create role:
```
create role "music-io-shared-server" with createdb login password 'some_password';
```
Create databases:
```
CREATE DATABASE "music-io-shared-server_development" OWNER "music-io-shared-server";
CREATE DATABASE "music-io-shared-server_test" OWNER "music-io-shared-server";
```
Then, do not forget to add them to your .env file at the root of the project.
```
DATABASE_URL=postgres://user:password@localhost:5432/music-io-shared-server_development
DATABASE_TEST_URL=postgres://user:password@localhost:5432/music-io-shared-server_test
```

## Redis configuration
In order to support the recommendation engine for songs and artists, redis is needed.
If you want to have redis running locally, then run:
```bash
sudo apt install redis-server
redis-server
```
Otherwise, you will need to set the following env variables:
- RACCOON_REDIS_URL
- RACCOON_REDIS_PORT
- RACCOON_REDIS_AUTH
