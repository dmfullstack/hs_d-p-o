FROM mysql/mysql-server:5.7

# Install JAVA
RUN yum -y install java-1.8.0-openjdk-devel \
    && yum clean all

# Setup JAVA environment
ENV JAVA_HOME /usr/lib/jvm/java-openjdk
ENV PATH $PATH:$JAVA_HOME/bin

# Install Node.js
RUN curl --location https://rpm.nodesource.com/setup_8.x | bash - \
    && yum -y install nodejs \
    && yum clean all

# Install yarn
RUN curl https://dl.yarnpkg.com/rpm/yarn.repo -o /etc/yum.repos.d/yarn.repo \
    && yum install -y yarn \
    && yum clean all

# Install Maven
RUN curl http://www-us.apache.org/dist/maven/maven-3/3.3.9/binaries/apache-maven-3.3.9-bin.tar.gz -o /opt/apache-maven-3.3.9-bin.tar.gz
RUN yum -y install tar && yum clean all
RUN tar -xzvf /opt/apache-maven-3.3.9-bin.tar.gz -C /opt/
ENV PATH $PATH:/opt/apache-maven-3.3.9/bin

# Install mongodb
ADD ./mongodb.repo /etc/yum.repos.d/mongodb.repo
RUN yum install -y mongo-10gen mongo-10gen-server

# To confirm which version of JAVA being used
RUN javac -version
RUN mysql --version
RUN node --version
RUN mvn --version

# no need to mount any volume as the DB has to be complete local
# VOLUME /var/lib/mysql

# No need to expose this port outside, as this DB should only be available locally
# EXPOSE 3306

RUN mkdir -p /languagepack-openjdk8mavenmysqlmongospringapp
WORKDIR /languagepack-openjdk8mavenmysqlmongospringapp

COPY package.json .
RUN yarn

COPY . .

CMD ["yarn", "boot"]
