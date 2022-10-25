# syntax=docker/dockerfile:1
FROM node:16.14.0-alpine

ENV PORT=3001

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
