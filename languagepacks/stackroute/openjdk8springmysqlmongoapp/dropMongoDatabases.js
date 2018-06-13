let async = require('async');
let MongoClient = require('mongodb').MongoClient;

function listDatabases(db, done) {
  db
    .admin()
    .listDatabases()
    .then((dbs) => done(null, dbs), (err) => done(err));
}

function dropAllDatabases(db, dbs, done) {
  console.log("Dropping ", dbs.databases.length, " number of databases");
  async.mapSeries(dbs.databases, dropDatabase.bind(null, db), done);
}

function dropDatabase(db, dbInstance, done) {
  if(dbInstance.name == 'admin' ||
    dbInstance.name == 'hobbes' ||
    dbInstance.name == 'hobbesDP' ||
    dbInstance.name == 'local') {
    //Don't want to drop these databases accidentally also.
    console.log("Ignoring drop database request for ", dbInstance.name);
    done(null, {name: dbInstance.name, result: false});
    return;
  }
  let instanceToDrop = db.db(dbInstance.name);
  instanceToDrop.dropDatabase((err, result) => {
    console.log("Dropped database ", dbInstance.name);
    done(null, {name: dbInstance.name, result});
    return;
  }, (err) => {
    console.log("Error in database ", dbInstance.name, " error ", err);
    done(err);
    return;
  });
}

module.exports = function(jobId, input, done) {
  console.log("Cleaning up database for ", jobId);
  try {
    console.log(`mongo details, HOST: ${process.env.MONGO_HOST}, PORT: ${process.env.MONGO_PORT}, URL: ${process.env.MONGO_URL}, USERNAME: ${process.env.MONGO_USER}, PASSWORD: ${process.env.MONGO_PASSWORD}`);
    let url = process.env.MONGO_URL || "mongodb://localhost:27017/nodejsmongo";
    // console.log('Connecting to db: ', url);
    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log("Error in connecting to DB ", err);
        done(err);
        return;
      }
      console.log("Successfully connected to ", db.databaseName);

      async.waterfall([
        listDatabases.bind(null, db),
        dropAllDatabases.bind(null, db)
      ], (err, results) => {
        if (err) {
          console.log("Error in dropping databases ", err);
        } else {
          console.log("Result of dropping database ", results);
        }
        db.close();
        done(err, input);
      });
    });
  } catch (err) {
    console.log("Error in cleaning up DB ", err);
    done(err, input);
  }
}
