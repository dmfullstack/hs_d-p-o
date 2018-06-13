const cassandra = require('cassandra-driver');
const config = require('./config');
const client = new cassandra.Client({
  contactPoints: [ config.CASSANDRA_HOST],
  protocolOptions: { port: config.CASSANDRA_PORT },
  socketOptions: { readTimeout: 48000}
});

module.exports = function(jobId, input, done){
  client.execute("CREATE KEYSPACE " + config.CASSANDRA_KEYSPACE + " WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '1' }", (err, res) => {
    if(err){ console.log("error in creating KEYSPACE", err); done(err)};

    done(null, res);
    return;
  })
}