FROM mhart/alpine-node:8.9

RUN apk update \
    && apk add openjdk8 \
    && apk add maven \
    && npm install yarn -g

ENV JAVA_HOME /usr/lib/jvm/java-1.8-openjdk
ENV PATH $PATH:$JAVA_HOME/bin

RUN javac -version

RUN mkdir -p /languagepack-openjdk8maven
WORKDIR /languagepack-openjdk8maven

COPY package.json .
RUN yarn

COPY . .

CMD ["yarn", "start"]
