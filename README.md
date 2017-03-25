# tp-taller-de-programacion-2-Shared-Server
Shared server repository for the semestral project of the subject 'Taller de Programación II'
of the University of Buenos Aires which consist of doing an application similar to Spotify.
This application is called 'music-io'.

## Heroku instance
https://music-io-shared-server.herokuapp.com/

## Run docker container
Note: Execute the following commands at the root of the project.
### Running the application
 - Run the docker image linked to a PostgreSQL database
```bash
docker-compose up
```
### Contribute to the seed file
If you want to add example data to the seed file (server/config/db/seed.sql), then you will have
to delete the container and the associated volume:
```bash
docker-compose rm -v postgres
```
And once then, run the container again:
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
