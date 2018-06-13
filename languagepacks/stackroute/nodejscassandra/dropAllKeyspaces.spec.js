const async = require('async');
const MongoClient = require('mongodb').MongoClient;
const dropAllDatabases = require('./dropAllDatabases');
const expect = require('chai').expect;

describe('Test for drop all database', function() {
  it('Drop all database ', function(testDone) {
    this.timeout(5000);

    let url = process.env.MONGO_URL || "mongodb://localhost:27017/new";
    MongoClient.connect(url, function(err, db) {
      if (err) {
        console.log("Error in connecting to DB ", err);
        testDone(err);
        return;
      }
      console.log("Connected to ", db.databaseName);

      async.waterfall([
        function(db, done) {
          let databases = ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7'];
          async.each(databases, function(dbName, crateDone) {
            // console.log("Creating db ", dbName);
            let newdb = db.db(dbName);
            newdb.collection(dbName).insertOne({dbName}, crateDone);
          }, done);
        }.bind(null, db),
        function(db, done) {
          db
            .admin()
            .listDatabases()
            .then((dbs) => done(null, dbs.databases.length), (err) => done(err));
        }.bind(null, db),
        function(db, totalDBs, done) {
          if (totalDBs < 0) {
            done('no databases to drop ');
            return;
          }

          dropAllDatabases('X1B2M3', { input: 'this is input' }, (err, results) => {
            if (err) {
              done(err);
              return;
            }

            db.admin().listDatabases().then((dbs) => {
              done(null, { before: totalDBs, after: dbs.databases.length });
            }, (err) => done(err));
          });
        }.bind(null, db)
      ], (err, finalResults) => {
        db.close();

        if (err) {
          console.log("Error ", err);
          testDone(err);
          return;
        }
        console.log("Dropping Done ", finalResults);
        expect(finalResults).to.not.equal(undefined);
        expect(finalResults.before).to.not.equal(0);
        expect(finalResults.after).to.not.equal(finalResults.before);
        expect(finalResults.after).to.equal(0);
        testDone();
      });
    });
  })
})
