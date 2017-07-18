let dbURI = 'mongodb://192.168.99.100:27017/hb2';
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

describe("Application", () => {
    it("should be able to insert sample data", (done) => {
        MongoClient.connect(dbURI)
            .then(function (db) {
                let user = {'name': 'Paweł'};
                db.collection('users')
                    .insert(user)
                    .then((res) => {
                        assert(user._id !== undefined);
                        assert(res.insertedCount === 1);
                        db.close();
                        done();
                    });
            })
            .catch((err) => {
            })
    });
});