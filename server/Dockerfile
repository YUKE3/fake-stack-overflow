FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN mkdir /app/node_modules && chown -R node:node /app

USER node

RUN npm install

COPY --chown=node:node . .

EXPOSE 8000

CMD [ "node", "server" ]