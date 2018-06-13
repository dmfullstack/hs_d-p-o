FROM cassandra:3.11.0

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN apt-get update \
    && apt-get install -y netcat \
    && npm install yarn -g \
    && npm install mocha -g \
    && apt-get clean

VOLUME /data/db

RUN mkdir -p /languagepack-nodejscassandra

WORKDIR /languagepack-nodejscassandra

COPY package.json .

RUN yarn

COPY . .

ENV CASSANDRA_URL='cassandra://127.0.0.1:9042/'
ENV CASSANDRA_KEYSPACE='cassandradb'
ENV CASSANDRA_HOST='127.0.0.1'
ENV CASSANDRA_PORT='9042'
ENV CASSANDRA_USER=''
ENV CASSANDRA_PASSWORD=''

# EXPOSE 9042
# 7199

CMD ["npm", "run", "boot"]