let app = require('./src/routes.js').app;

let dbURI = process.env.MONGO_URI || 'mongodb://192.168.99.100:27017/hb2';
let MongoClient = require('mongodb').MongoClient;
let connection = MongoClient.connect(dbURI);


let UserRepository = require('./src/users/UserRepository.js').UserRepository;

let repositories = {
    userRepository: new UserRepository(connection),
    animalRepository: () => {},
    huntingRepository: () => {},
    huntingAreaRepository: () => {}
};

app(repositories);

