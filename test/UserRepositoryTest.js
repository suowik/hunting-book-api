let UserRepository = require('../src/users/UserRepository.js').UserRepository;

let dbURI = 'mongodb://192.168.99.100:27017/hb2';
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let connection = MongoClient.connect(dbURI);

describe("UserRepository", () => {
    it("should be able to insert sample data", (done) => {
        let userRepo = new UserRepository(connection);
        userRepo
            .create({name: 'asad'})
            .then((res) => {
                assert(res.insertedCount === 1);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });
});

