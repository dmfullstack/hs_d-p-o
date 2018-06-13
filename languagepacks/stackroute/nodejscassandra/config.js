module.exports = {
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  AMQP_URL: process.env.AMQP_URL || 'amqp://localhost',
  CASSANDRA_HOST: process.env.CASSANDRA_HOST || 'localhost',
  CASSANDRA_PORT: process.env.CASSANDRA_PORT || '9042',
  CASSANDRA_URL: process.env.CASSANDRA_URL || 'cassandra://localhost:9042',
  WORKSPACE_DIR: process.env.WORKSPACE_DIR || '/workspaces',
  CMD_PREFIX: process.env.CMD_PREFIX || './cmd',
  QUEUE_NAME: process.env.QUEUE_NAME || 'stackroute/nodejscassandra',
  CASSANDRA_KEYSPACE: process.env.CASSANDRA_KEYSPACE || 'cassandradb'
}