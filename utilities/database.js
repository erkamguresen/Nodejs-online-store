const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  //MongoClient.connect('mongodb://localhost/node-app')
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      console.log('Connected To MongoDB\n');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No Database';
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
