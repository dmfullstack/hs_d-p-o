module.exports = {
  AMQP_URL: process.env.AMQP_URL || 'amqp://localhost',
  CMD_PREFIX: process.env.CMD_PREFIX || './cmd',
  QUEUE_NAME: process.env.QUEUE_NAME || 'serviceWorkers/unix',
  SW_RESULT_QUEUE_NAME: process.env.SW_RESULT_QUEUE_NAME || 'serviceWorkers/results',
}
