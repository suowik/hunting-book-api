let dbURI = 'mongodb://192.168.99.100:27017/hb'
let mongoose = require('mongoose');
let userSchema = require('../model/schemas.js').userSchema;
let User = mongoose.model('User', userSchema);

mongoose.Promise = global.Promise;

describe("Example spec for a model", function () {
    beforeEach((done) => {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, {useMongoClient: true}, done);
    });

    it("can be saved", (done) => {
        new User({name: 'Paweł'}).save(done);
    });
});