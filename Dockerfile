FROM node:alpine

WORKDIR /src

COPY package*.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8000

CMD [ "npm", "start" ]