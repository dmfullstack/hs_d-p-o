const cassandra = require('cassandra-driver');
const config = require('./config');
const lodash = require('lodash');
const async = require('async');

const client = new cassandra.Client({
  contactPoints: [config.CASSANDRA_HOST],
  protocolOptions: { port: config.CASSANDRA_PORT },
  socketOptions: { readTimeout: 48000 }
});

function dropKeyspace(keyspace, callback) {
  client.execute('DROP KEYSPACE ' + keyspace, (err) => {
    if (err) { callback(err); return; }
    callback(null);
    return;
  })
}

function cleanupDb(callback) {
  client.execute('SELECT keyspace_name FROM system_schema.keyspaces', (err, res) => {
    if (err) {
      callback(err);
      return;
    }

    let keyspaces = res.rows;
    let dropDBTasks = [];

    lodash.each(keyspaces, (item) => {
      let currentKeyspace = item.keyspace_name.toString();
      if (currentKeyspace.indexOf('system') === -1) {
        dropDBTasks.push(dropKeyspace.bind(null, currentKeyspace));
      }
    });

    if (dropDBTasks.length > 0) {
      async.parallel(dropDBTasks, (err, result) => {
        if (err) {
          callback(err);
          return;
        }

        callback(null);
        return;
      });
    } else {
      console.log("No databases required to be dropped, skipping dropping of databases...!");
      callback();
      return;
    }

  });
}

module.exports = function(jobId, input, done) {
  client.connect(function(err) {
    if (!err) {
      console.log('Connection to cassandra established');

      cleanupDb((err) => {
        if (err) {
          console.log('There was error while cleaning up db in cassandra ', err);
          done(err, null);
        } else {
          console.log('Cleaned up cassandra DB');
          done(null, input);
        }
      })
    } else {
      console.log('Connection to cassandra is failed', err);
      done(err);
    }
  });
}