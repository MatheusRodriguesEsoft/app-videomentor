FROM node:18-alpine

WORKDIR /usr/app
COPY package.json yarn.lock ./

RUN  yarn

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]
