module.exports = {
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  AMQP_URL: process.env.AMQP_URL || 'amqp://localhost',
  MONGO_URL: process.env.MONGO_URL || 'mongo://localhost:27017',
  WORKSPACE_DIR: process.env.WORKSPACE_DIR || '/workspaces',
  CMD_PREFIX: process.env.CMD_PREFIX || './cmd',
  QUEUE_NAME: process.env.QUEUE_NAME || 'stackroute/openjdk8springmysqlmongoapp'
}
