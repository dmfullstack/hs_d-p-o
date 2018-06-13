module.exports = {
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  AMQP_URL: process.env.AMQP_URL || 'amqp://localhost',
  WORKSPACE_DIR: process.env.WORKSPACE_DIR || '/workspaces',
  PORT: process.env.PORT || 8081,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/hobbesDP',
  SERVICE_WORKER_MQ_UNIX: 'serviceWorkers/unix'
}
