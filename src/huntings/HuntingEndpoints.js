let Endpoints = require('../common/Endpoints.js').Endpoints;
class HuntingEndpoints extends Endpoints {
    constructor(router, repository) {
        super(router, repository);
    }
}

module.exports = {
    HuntingEndpoints: HuntingEndpoints
};