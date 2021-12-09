FROM node:16-alpine

RUN apk add dumb-init

ENV MONGO_DB_USERNAME=admin \
    MONGO_DB_PWD=password \
    NODE_ENV=production

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY --chown=node:node . /usr/src/app

RUN npm ci --only=production

USER node

EXPOSE 8080

CMD ["dumb-init", 'node', 'server.js']