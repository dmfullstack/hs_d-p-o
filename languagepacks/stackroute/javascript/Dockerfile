FROM mhart/alpine-node:8.9

RUN apk update\
    && apk add python build-base \
    && npm install yarn -g \
    # && npm install eslint@3.19.0 -g \
    && npm install babel-eslint -g \
    && npm install htmlhint -g \
    && npm install mocha -g

RUN mkdir -p /languagepack-javascript
WORKDIR /languagepack-javascript

COPY package.json .
RUN yarn

COPY . .

CMD ["yarn", "start"]
