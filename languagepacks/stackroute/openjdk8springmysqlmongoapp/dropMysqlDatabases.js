const mysql = require('mysql');
const async = require('async');
//This are default databases created when mysql is started
const defaultList = ["information_schema", "mysql", "performance_schema", "sys"];

/**
 * The code which is being evaluated by the language pack
 * can access the database using these environment variables
 * MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD & MYSQL_DATABASE
 *
 * Language pack will use a different credentials for Administration,
 * these username are intentially kept cryptic, so the code does tamper usign the same
 **/

console.log(`MYSQL ENV vars
  HOST: ${process.env.MYSQL_HOST},
  ADMIN_USER: ${process.env.MYSQL_LP_AC},
  ADMIN_PASSWORD: ${process.env.MYSQL_LP_ACP},
  USER: ${process.env.MYSQL_USER},
  PWD: ${process.env.MYSQL_PASSWORD}
  DATABASE: ${process.env.MYSQL_DATABASE}`);

// add code comment
const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_LP_AC || 'root',
  password: process.env.MYSQL_LP_ACP || ''
});

const listAllDatabases = function(jobId, done) {
  connection.query('SHOW DATABASES', (err, result) => {
    if (err) {
      return done(err);
    }
    // We just need the name only
    let dbNameArray = result.map((database) => database.Database);

    // Filter out for default schema
    dbNameArray = dbNameArray.filter((database) => defaultList.indexOf(database) < 0);

    done(null, dbNameArray);
  });
}

const dropDatabase = function(db, done) {
  if (!db) return callback(null, {});

  console.log('Dropping database ', db);

  connection.query(`DROP DATABASE ${db}`, done);
}

const dropAllDatabases = function(jobId, databaseNames, done) {
  console.log("[*] Qualified ", databaseNames.length, " number of databases to drop ", databaseNames);

  async.mapSeries(databaseNames, dropDatabase, done);
}

// creating database student after Dropping the database is completed
const createDefaultDatabase = function(jobId, result, done){
  console.log(`[*] Creating default database ${process.env.MYSQL_DATABASE}`)

  connection.query(`CREATE DATABASE ${process.env.MYSQL_DATABASE}`, done);
}

module.exports = function(jobId, input, done) {
  console.log('[*] Cleaning up MySQL Database by dropping databases for job ', jobId);

  async.waterfall([
    listAllDatabases.bind(null, jobId),
    dropAllDatabases.bind(null, jobId),
    createDefaultDatabase.bind(null, jobId)
  ], (err, result) => {
    if (err) {
      console.log("[*] Error in dropping databases, ERR::", err);
      return done(null, result);
    }

    if (result && result.length === 0) {
      console.log('[*] No databases dropped...!');
    } else {
      console.log('[*] Dropped databases ', result);
    }
    done(null, result);
  });
}
