# syntax=docker/dockerfile:1
FROM node:14.15.1
WORKDIR /app


# install app dependencies
COPY ["package.json", "yarn.lock*", "./"]
RUN yarn install
COPY . .
RUN yarn build

CMD [ "yarn", "start" ]