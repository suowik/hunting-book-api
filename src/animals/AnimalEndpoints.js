let Endpoints = require('../common/Endpoints.js').Endpoints;
class AnimalEndpoints extends Endpoints {
    constructor(router, repository) {
        super(router, repository);
    }
}

module.exports = {
    AnimalEndpoints: AnimalEndpoints
};