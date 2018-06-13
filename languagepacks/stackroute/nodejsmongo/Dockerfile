FROM mhart/alpine-node:8.9

# RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.4/main" >> /etc/apk/repositories
# RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.4/community" >> /etc/apk/repositories
# RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.6/main" >> /etc/apk/repositories
# RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.6/community" >> /etc/apk/repositories
# RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories
# RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories

RUN apk update \
    && apk add python build-base \
    && apk add --no-cache mongodb \
    && npm install yarn -g \
    && npm install mocha -g

RUN rm /usr/bin/mongoperf

VOLUME /data/db

RUN mkdir -p /languagepack-nodejsmongo
WORKDIR /languagepack-nodejsmongo

COPY package.json .
RUN yarn

COPY . .

# No need to expose these ports outside as mongodb is for exclusive use of this container only
# EXPOSE 27017 28017

# IP 172.17.0.1 or 127.0.0.1 refers to local container
ENV MONGO_URL='mongodb://127.0.0.1:27017/student'
ENV MONGO_HOST='127.0.0.1'
ENV MONGO_PORT='27017'
ENV MONGO_USER=''
ENV MONGO_PASSWORD=''

# CMD ["yarn boot"] #For strange reason this is not working on AWS
CMD ["npm", "run", "boot"]
