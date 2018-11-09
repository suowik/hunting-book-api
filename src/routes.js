let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let cors = require('cors');
let boolParser = require('express-query-boolean');
let port = process.env.PORT || 3001;

let auth = require('../src/auth.js');
let secret = process.env.AUTH_SECRET || 'dupa';

let UserEndpoints = require('./users/UserEndpoints.js').UserEndpoints;
let AnimalEndpoints = require('./animals/AnimalEndpoints.js').AnimalEndpoints;
let HuntingEndpoints = require('./huntings/HuntingEndpoints.js').HuntingEndpoints;
let HuntingAreaEndpoints = require('./huntingAreas/HuntingAreasEndpoints.js').HuntingAreaEndpoints;
let AnnouncementEndpoints = require('./announcements/AnnouncementEndpoints.js').AnnouncementEndpoints;

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
    app.use(boolParser());
    app.use(morgan('dev'));
    app.use(cors());

    app.post('/login', auth.loginHandler(secret, repositories.userRepository));

    app.use('/users', new UserEndpoints(express.Router(), repositories.userRepository).routes);
    app.use('/announcements', new AnnouncementEndpoints(protectedRoutes(express.Router(), auth, secret), repositories.announcementRepository).routes);
    app.use('/animals', new AnimalEndpoints(protectedRoutes(express.Router(), auth, secret), repositories.animalRepository).routes);
    app.use('/huntings', new HuntingEndpoints(protectedRoutes(express.Router(), auth, secret), repositories.huntingRepository).routes);
    app.use('/huntingAreas', new HuntingAreaEndpoints(protectedRoutes(express.Router(), auth, secret), repositories.huntingAreaRepository).routes);


    app.listen(port, () => {
        console.log('Started')
    });
};

module.exports = {
    app: app
};

