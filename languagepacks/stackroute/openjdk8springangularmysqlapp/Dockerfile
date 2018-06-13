FROM ubuntu:16.04

RUN apt-get update \
		&& apt-get install -y wget \
		&& apt-get install -y curl

# Install Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
# RUN apt-get update && apt-get install -y google-chrome-stable

RUN apt-get update \
	 && apt-get install -y google-chrome-stable \
	 && apt-get install -y openjdk-8-jdk \
	 && apt-get install -y maven \
	 && apt-get clean

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

# RUN sed -i 's|HERE/chrome\"|HERE/chrome\" --disable-setuid-sandbox|g' /opt/google/chrome/google-chrome

RUN npm install --global yarn

# RUN npm install -g @angular/cli@latest

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get install -y mysql-server \
	  && apt-get clean

# ENV JAVA_HOME /usr/lib/jvm/java-1.8-openjdk
# ENV PATH $PATH:$JAVA_HOME/bin

RUN javac -version
RUN mysql --version
RUN node --version
RUN mvn --version

COPY docker-entrypoint.sh /entrypoint.sh

RUN mkdir -p /languagepack-openjdk8springangularmysqlapp
WORKDIR /languagepack-openjdk8springangularmysqlapp

COPY package.json .

RUN yarn

COPY . .

CMD ["yarn", "boot"]
