let app = require('./src/routes.js').app;

let dbURI = process.env.MONGODB_URI || 'mongodb://192.168.99.100:27017/hb2';
console.log(dbURI)
let MongoClient = require('mongodb').MongoClient;
let connection = MongoClient.connect(dbURI);


let UserRepository = require('./src/users/UserRepository.js').UserRepository;
let AnimalRepository = require('./src/animals/AnimalRepository.js').AnimalRepository;
let HuntingRepository = require('./src/huntings/HuntingRepository.js').HuntingRepository;
let HuntingAreasRespository = require('./src/huntingAreas/HuntingAreaRepository.js').HuntingAreaRepository;

let repositories = {
    userRepository: new UserRepository(connection),
    animalRepository: new AnimalRepository(connection),
    huntingRepository: new HuntingRepository(connection),
    huntingAreaRepository: new HuntingAreasRespository(connection)
};

app(repositories);

