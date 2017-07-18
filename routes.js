let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');

let port = process.env.PORT || 3000;
let secret = process.env.AUTH_SECRET || 'dupa';

let app = (userRepository, auth) => {
    let app = express();
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.use(morgan('dev'));

    app.set('secret', secret);

    let apiRoutes = express.Router();

    if (process.env.ENV === 'prod') {
        apiRoutes.use(auth.authorizationFilter(app.get('secret')));
    }

    apiRoutes.get('/users', (req, res) => {
        res.json({'a': 'a', 'b': 'b'})
    });

    app.use('/api', apiRoutes);

    app.post('/login', auth.loginHandler(app.get('secret'), userRepository));

    app.get('/', (req, res) => {
        res.send('Hello World!')
    });

    app.listen(port, () => {
        console.log('Started')
    });
};

module.exports = {
    app: app
};

