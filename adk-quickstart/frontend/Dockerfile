FROM node:20-alpine

WORKDIR /usr/src/app

ENV CI=true

COPY package.json ./
COPY tsconfig.json ./
RUN npm install

COPY public ./public
COPY src ./src

RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3000

CMD ["npm", "start"]
