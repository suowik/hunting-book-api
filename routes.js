let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');

let port = process.env.PORT || 3000;
let secret = process.env.AUTH_SECRET || 'dupa';

let userRoutes = require('./users/userRoutes.js').userRoutes;

let app = (repositories, auth) => {
    let app = express();
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(morgan('dev'));

    app.set('secret', secret);

    let router = express.Router();

    if (process.env.ENV === 'prod') {
        router.use(auth.authorizationFilter(app.get('secret')));
    }

    app.use('/api', router);
    app.use('/', userRoutes(express.Router(), repositories.userRepository));
    app.post('/login', auth.loginHandler(app.get('secret'), repositories.userRepository));

    app.listen(port, () => {
        console.log('Started')
    });
};

module.exports = {
    app: app
};

