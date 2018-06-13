FROM ubuntu:16.04
FROM mongo:3.6-jessie

RUN apt-get update \
		&& apt-get install -y wget \
		&& apt-get install -y curl \
    && apt-get install -y perl \
    && apt-get install -y libhttp-message-perl

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main"  >> /etc/apt/sources.list.d/google.list'

# RUN apt-get update && apt-get install -y google-chrome-stable

RUN apt-get update \
	 && apt-get install -y google-chrome-stable \
	 && apt-get clean

# RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5

# RUN sh -c 'echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" >> /etc/apt/sources.list.d/mongodb-org-3.6.list'

RUN rm /usr/bin/mongoperf

VOLUME /data/db

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# RUN sed -i 's|HERE/chrome\"|HERE/chrome\" --disable-setuid-sandbox|g' /opt/google/chrome/google-chrome

RUN npm install --global yarn


# install mongodb

# RUN sh -c 'echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" >> /etc/apt/sources.list.d/mongodb-org-3.6.list'
# RUN apt-get update \
#     && apt-get install -y mongodb-org

# RUN npm install -g @angular/cli@latest

# ENV DEBIAN_FRONTEND=noninteractive
# RUN apt-get install -y mysql-server \
# 	  && apt-get clean

# ENV JAVA_HOME /usr/lib/jvm/java-1.8-openjdk
# ENV PATH $PATH:$JAVA_HOME/bin

# RUN mysql --version
RUN node --version
RUN mongo --version

# COPY docker-entrypoint.sh /entrypoint.sh

RUN mkdir -p /languagepack-nodejsmongoangularapp
WORKDIR /languagepack-nodejsmongoangularapp

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


CMD ["yarn", "boot"]
