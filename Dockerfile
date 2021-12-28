FROM node:17-alpine
WORKDIR /usr/src/app
COPY . .
RUN yarn --frozen-lockfile
RUN yarn build
CMD ["yarn", "start"]