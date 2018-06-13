FROM microsoft/dotnet:2.0.0-sdk

RUN apt-get update \
    && apt-get install curl -y \
    && apt-get install wget -y

# Installing nodejs

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN npm install yarn -g

RUN dotnet --version
RUN npm --version
RUN yarn --version

RUN mkdir -p /languagepack-dotnetapp
WORKDIR /languagepack-dotnetapp

COPY package.json .

RUN yarn

COPY . .

CMD ["yarn", "start"]
