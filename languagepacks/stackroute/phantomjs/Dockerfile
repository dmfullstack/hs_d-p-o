FROM node:6

RUN apt-get -y update \
	&& apt-get -y install telnet \
    && npm install phantomjs --phantomjs_cdnurl=https://bitbucket.org/ariya/phantomjs/downloads \
    && npm install -g mocha-phantomjs

RUN mkdir -p /languagepack-phantom
WORKDIR /languagepack-phantom

COPY package.json .
RUN yarn

COPY . .

CMD ["yarn", "start"]
