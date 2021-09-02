const MongoClient = require('mongodb').MongoClient;
const dboper = require('./operations');

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';
// the db we made in the mongo REPL

// connect to mongodb server
// instead of using assert we'll use catch method
MongoClient.connect(url, { useUnifiedTopology: true }).then(client => {

    console.log('Connected correctly to server');
    const db = client.db(dbname);

    // deleting collection we made so we start fresh (drop = delete)
    db.dropCollection('campsites')
        .then(result => {
            console.log('Dropped Collection', result);
        })
        .catch(err => console.log('No collection to drop.'));

    // insert document into collection:
    dboper.insertDocument(db, { name: "Breadcrumb Trail Campground", description: "Test" }, 'campsites')
        .then(result => {
            console.log('Insert Document:', result.ops);
            // callback function result from the operations module (insert operation) that will run when insertDocument is called

            return dboper.findDocuments(db, 'campsites');
        })
        .then(docs => {
            console.log('Found Documents:', docs);

            return dboper.updateDocument(db, { name: "Breadcrumb Trail Campground" },
                // only works if this field has one document or else module won't know which to update
                { description: "Updated Test Description" }, 'campsites');
        })
        .then(result => {
            console.log('Updated Document Count:', result.result.nModified);
            return dboper.findDocuments(db, 'campsites');
        })
        .then(docs => {
            console.log('Found Documents:', docs);
            return dboper.removeDocument(db, { name: "Breadcrumb Trail Campground" },
                'campsites');
        })
        .then(result => {
            console.log('Deleted Document Count:', result.deletedCount);

            return client.close();
        })
        .catch(err => {
            console.log(err);
            client.close(); // error might be thrown to this catch block before other close method is called
        });
}) // end of connect then method
    .catch(err => console.log(err));

// replaced callbacks w/ promise chain