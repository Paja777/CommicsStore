FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# USER root

# RUN chown -R app:app .

# USER app

RUN npm install

COPY . .

EXPOSE 3100

CMD npm start