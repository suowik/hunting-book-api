let app = require('./routes.js').app;

let auth = require('./auth.js');

class MockUserRepository {
    findOne(name) {
        return new Promise((resolve, reject) => {
            resolve({password: 'abc', name: 'name'})
        })
    }
}

app(new MockUserRepository(), auth);

