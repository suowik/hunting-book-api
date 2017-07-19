let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let cors = require('cors');

let port = process.env.PORT || 3000;

let auth = require('../src/auth.js');
let secret = process.env.AUTH_SECRET || 'dupa';

let userEndpoints = require('./users/endpoints.js').userEndpoints;
let animalEndpoints = require('./animals/endpoints.js').animalEndpoints;
let huntingEndpoints = require('./huntings/endpoints.js').huntingEndpoints;
let huntingAreaEndpoints = require('./huntingAreas/endpoints.js').huntingAreaEndpoints;

let protectedRoutes = (router, auth, secret) => {
    if (process.env.ENV === 'prod') {
        router.use(auth.authorizationFilter(secret));
    }
    return router;
};

let app = (repositories) => {
    let app = express();
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(morgan('dev'));
    app.use(cors());

    app.post('/login', auth.loginHandler(secret, repositories.userRepository));

    app.use('/users', userEndpoints(protectedRoutes(express.Router(), auth, secret), repositories.userRepository));
    app.use('/animals', animalEndpoints(protectedRoutes(express.Router(), auth, secret), repositories.animalRepository));
    app.use('/huntings', huntingEndpoints(protectedRoutes(express.Router(), auth, secret), repositories.huntingRepository));
    app.use('/huntingAreas', huntingAreaEndpoints(protectedRoutes(express.Router(), auth, secret), repositories.huntingAreaRepository));


    app.listen(port, () => {
        console.log('Started')
    });
};

module.exports = {
    app: app
};

