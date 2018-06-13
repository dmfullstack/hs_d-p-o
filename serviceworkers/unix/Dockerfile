FROM mhart/alpine-node:8.9

RUN apk update\
    && npm install -g yarn
#    && apk add git openssh-client \

RUN mkdir -p /serviceworkers-unix
WORKDIR /serviceworkers-unix

COPY package.json .

RUN yarn

COPY . .

CMD ["yarn", "start"]
