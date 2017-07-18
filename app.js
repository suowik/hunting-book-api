let app = require('./routes.js').app;

let auth = require('./auth.js');


let dbURI = process.env.MONGO_URI || 'mongodb://192.168.99.100:27017/hb2';
let MongoClient = require('mongodb').MongoClient;
let connection = MongoClient.connect(dbURI);


let UserRepository = require('./users/UserRepository.js').UserRepository;

let repositories = {
    userRepository: new UserRepository(connection)
};

app(repositories, auth);

