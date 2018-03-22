FROM node:8.10.0

WORKDIR /src

RUN npm install -g gulp

RUN npm install

COPY . /src
