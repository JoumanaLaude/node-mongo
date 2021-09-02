const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';
// the db we made in the mongo REPL

// connect to mongodb server
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {

    assert.strictEqual(err, null);

    console.log('Connected correctly to server');

    const db = client.db(dbname);

    // deleting collection we made so we start fresh (drop = delete)
    db.dropCollection('campsites', (err, result) => {
        assert.strictEqual(err, null);
        console.log('Dropped Collection', result);

        // create campsites collection:
        // const collection = db.collection('campsites');

        // insert document into collection:
        // collection.insertOne
        dboper.insertDocument(db, { name: "Breadcrumb Trail Campground", description: "Test" },
            'campsites', result => {
                console.log('Insert Document:', result.ops);
                // callback function result from the operations module (insert operation) that will run when insertDocument is called

                dboper.findDocuments(db, 'campsites', docs => {
                    console.log('Found Documents:', docs);

                    dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
                        // only works if this field has one document or else module won't know which to update
                        { description: "Updated Test Description" }, 'campsites',
                        result => {
                            console.log('Updated Document Count:', result.result.nModified);

                            dboper.findDocuments(db, 'campsites', docs => {
                                console.log('Found Documents:', docs);

                                dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
                                    'campsites', result => {
                                        console.log('Deleted Document Count:', result.deletedCount);

                                        // immediately will close and exit
                                        client.close();
                                    });
                            });
                        });
                });
            });
    });
});