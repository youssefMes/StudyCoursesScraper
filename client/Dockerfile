FROM node:18-alpine

WORKDIR /client

EXPOSE 3000

RUN yarn set version berry

COPY ./package.json ./

RUN yarn

RUN yarn rebuild esbuild

CMD ["yarn", "dev"]