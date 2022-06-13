FROM node:16-alpine

# add bash
RUN apk update \
    apk upgrade \
    apk add bash 

WORKDIR /app
COPY . /app
RUN npm install
