let Endpoints = require('../common/Endpoints.js').Endpoints;
class AnnouncementEndpoints extends Endpoints {
    constructor(router, repository) {
        super(router, repository);
    }
}

module.exports = {
    AnnouncementEndpoints: AnnouncementEndpoints
};