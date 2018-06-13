const mssql = require('mssql');
const async = require('async');

// These are the default databases which are created by the database at the time of initialization
const defaultList = ["master", "model", "msdb", "tempdb"];

/**
 * The code which is being evaluated by the language pack
 * can access the database using these environment variables
 * MSSQL_HOST, MSSQL_USER, SA_PASSWORD & MSSQL_DATABASE
 *
 * Language pack will use the same credentials for Administration,
 * these username are intentially kept cryptic, so the code does tamper usign the same
 **/

console.log(`MSSQL ENV vars
  HOST: ${process.env.MSSQL_HOST},
  URL: ${process.env.MSSQL_URL},
  USER: ${process.env.MSSQL_USER},
  PWD: ${process.env.SA_PASSWORD}
  DATABASE: ${process.env.MSSQL_DATABASE}`);

// connecting to MSSQL database using the folloeing environment variables
const connection = mssql.connect({
  server: process.env.MSSQL_HOST || 'localhost',
  user: process.env.MSSQL_USER || 'sa',
  password: process.env.SA_PASSWORD || 'student@123',
  port: process.env.MSSQL_PORT || '1433',
  connectionTimeout: 300000,
  requestTimeout: 300000
});

// for every request done for dropping the instance of the database
let request = new mssql.Request();

let listAllDatabases = function(jobId, done) {
  request.query('sp_databases', (err, result) => {
    if (err) {
      console.log("", err);
      return done(err);
    }
    // We just need the names of the databases only
    let dbNameArray = result.recordset.map((database) => database.DATABASE_NAME);

    // Filter out for default schema (defaultList)
    dbNameArray = dbNameArray.filter((database) => defaultList.indexOf(database) < 0);

    done(null, dbNameArray);
  });
}

let dropDatabase = function(db, done) {
  //error 
  if (!db) return done(null, {});

  console.log('Dropping database ', db);

  request.query(`DROP DATABASE ${db}`, done);
}

let dropAllDatabases = function(jobId, databaseNames, done) {
  console.log("[*] Qualified ", databaseNames.length, " number of databases to drop ", databaseNames);

  async.mapSeries(databaseNames, dropDatabase, done);
}

// creating database student after Dropping the database is completed
let createDefaultDatabase = function(jobId, result, done){
  console.log(`[*] Creating default database ${process.env.MSSQL_DATABASE}`)

  request.query(`CREATE DATABASE ${process.env.MSSQL_DATABASE}`, done);
}

module.exports = function(jobId, input, iii, done) {
  console.log('[*] Cleaning up MSSQL Database by dropping databases for job ', jobId);

  async.waterfall([
    listAllDatabases.bind(null, jobId),
    dropAllDatabases.bind(null, jobId),
    createDefaultDatabase.bind(null, jobId)
  ], (err, result) => {
    if (err) {
      console.log("[*] Error in dropping databases, ERR::", err);
      return done(err, result);
    }

    if (result && result.length === 0) {
      console.log('[*] No databases dropped...!');
    } else {
      console.log('[*] Dropped databases ', result);
    }
    done(null, result);
  });
}
