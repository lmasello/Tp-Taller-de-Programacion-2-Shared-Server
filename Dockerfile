# our base image
FROM ubuntu:16.04

# install system-wide deps for node
RUN apt-get -yqq update
RUN apt-get -yqq install curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get -yqq install nodejs
RUN apt-get -yqq install build-essential

# copy our application code
ADD . /usr/src/music-io-shared-server
WORKDIR /usr/src/music-io-shared-server

# fetch app specific deps
RUN npm install

# specify the port number the container should expose
EXPOSE 3000

# run the application
CMD ["nodejs", "./app.js"]
