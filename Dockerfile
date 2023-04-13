FROM node:14.21.3

WORKDIR /app
COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm install -g pm2
RUN npm install
RUN pm2 install typescript

COPY . /app

ENTRYPOINT ["/bin/sh", "-c" , "pm2 start && pm2 logs"]