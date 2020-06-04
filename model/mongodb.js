const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let db = null

MongoClient.connect('mongodb://localhost:27017', function(err, client) {
  assert.equal(null, err);
  console.log('Connected successfully to server');
  db = client.db('test');
  client.close();
});

module.exports = db
