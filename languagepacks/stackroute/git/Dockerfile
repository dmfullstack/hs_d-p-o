FROM mhart/alpine-node:8.9

RUN apk update \
    && apk add git openssh-client \
    && npm install -g yarn

RUN mkdir -p /languagepack-git
WORKDIR /languagepack-git

COPY package.json .
RUN yarn

COPY . .

CMD ["yarn", "start"]
