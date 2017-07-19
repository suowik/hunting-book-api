let Endpoints = require('../common/Endpoints.js').Endpoints;
class UserEndpoints extends Endpoints {
    constructor(router, repository) {
        super(router, repository);
    }
}

module.exports = {
    UserEndpoints: UserEndpoints
};