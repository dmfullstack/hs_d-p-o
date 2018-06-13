FROM microsoft/mssql-server-linux:latest

RUN apt-get update \
    && apt-get install curl -y \
    && apt-get install wget -y \
    && apt-get install netcat -y

# Installing nodejs

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN npm install yarn -g

# Installing mssql tools for using cli commands
# Un comment the following installation of the mssql-tools to use the database in commandline
# RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
# RUN curl -sL https://packages.microsoft.com/config/ubuntu/16.04/mssql-server-2017.list | tee /etc/apt/sources.list.d/mssql-server.list
# RUN apt-get update \
#     && apt-get install -y mssql-tools unixodbc-dev

# Installing dotnet sdk version 2.0.0

RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-xenial-prod xenial main" > /etc/apt/sources.list.d/dotnetdev.list'
RUN apt-get update \
    && apt-get install -y dotnet-sdk-2.0.0

RUN dotnet --version
RUN npm --version
RUN yarn --version

RUN mkdir -p /languagepack-dotnetmssqlapp
WORKDIR /languagepack-dotnetmssqlapp

COPY package.json .

RUN yarn

COPY . .

CMD ["yarn", "boot"]
