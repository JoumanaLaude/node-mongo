const assert = require('assert').strict;

// db we're using, doc we want to insert, collection doc is in, callback at the end of each method
exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.insertOne(document, (err, result) => {
        assert.strictEqual(err, null);
        callback(result);
        // callback that's defined somewhere else
    });
};

exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection);
    coll.find().toArray((err, docs) => {
        assert.strictEqual(err, null); // checking if any error when converting to array
        callback(docs); // if not we take the array and run this callback
    });
};

exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.deleteOne(document, (err, result) => {
        assert.strictEqual(err, null); 
        callback(result); 
    });
};

exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    coll.updateOne(document, { $set: update }, null, (err, result) => {
        assert.strictEqual(err, null);
        callback(result);
    });
};
