# last update 17:08

FROM node:6-alpine

WORKDIR /usr/src/app

COPY package.json .
RUN npm install

COPY . .

EXPOSE 1337

CMD [ "npm", "start" ]