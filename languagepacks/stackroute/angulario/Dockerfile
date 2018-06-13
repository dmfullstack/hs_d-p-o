FROM ubuntu:16.04

RUN apt-get update \
		&& apt-get install -y wget \
		&& apt-get install -y curl

# Install Google Chrome
# Refer https://github.com/ebidel/lighthouse-ci/blob/master/builder/Dockerfile.headless
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'

RUN apt-get update \
	 && apt-get install -y google-chrome-stable \
	 && apt-get install -y netcat \
	 && apt-get clean

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN npm install --global yarn

# RUN npm install -g @angular/cli@latest

RUN node --version

RUN mkdir -p /languagepack-angulario
WORKDIR /languagepack-angulario

COPY package.json .

# Installs require dependencies
RUN yarn

COPY . .

CMD ["yarn", "start"]
