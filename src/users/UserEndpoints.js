let Endpoints = require('../common/Endpoints.js').Endpoints;

class UserEndpoints extends Endpoints {
    constructor(router, repository) {
        super(router, repository);
        this.routes = this.registerRoute((router, repository) => {
            router.get('/exists/:login', async (req, res) => {
                let exists = await repository.userExists(req.params.login);
                res.json({"exists": exists})
            })
        })
    }
}

module.exports = {
    UserEndpoints: UserEndpoints
};