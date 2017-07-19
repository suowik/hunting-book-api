let Endpoints = require('../common/Endpoints.js').Endpoints;
class HuntingAreaEndpoints extends Endpoints {
    constructor(router, repository) {
        super(router, repository);
    }
}

module.exports = {
    HuntingAreaEndpoints: HuntingAreaEndpoints
};