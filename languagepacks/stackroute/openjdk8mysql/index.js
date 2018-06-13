const registerWorker = require('./registerWorker');
const config = require('./config');
const worker = require('./worker');

process.stdout.write("Running agent for " + config.QUEUE_NAME);

registerWorker(config.QUEUE_NAME, worker);
