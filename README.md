# tp-taller-de-programacion-2-Shared-Server
Shared server repository for the semestral project of the subject 'Taller de Programación II' of the University of Buenos Aires which consist of doing an application similar to Spotify.

## Heroku instance
https://music-io-shared-server.herokuapp.com/

## Run docker container
Execute the following commands at the root of the project:

 - Get the docker image
```bash
docker pull lmasello/music-io-shared-server
```
 - Run the image
```bash
docker run -p 8888:[server_port] lmasello/music-io-shared-server
```

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
