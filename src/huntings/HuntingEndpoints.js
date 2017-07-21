let Endpoints = require('../common/Endpoints.js').Endpoints;
class HuntingEndpoints extends Endpoints {
    constructor(router, repository) {
        super(router, repository);
        this.routes = this.registerRoute((router, repository) => {
            router.get('/started/:userId', (req, res) => {
                repository.findStartedHuntingsOfUser(req.params.userId)
                    .then(huntings => {
                        res.json(huntings)
                    })
                    .catch(err => {
                        res.sendStatus(500)
                    })
            })
        })
        this.routes = this.registerRoute((router, repository) => {
            router.post('/finish', (req, res) => {
                repository.finish(req.body)
                    .then(hunting => {
                        res.sendStatus(200)
                    })
                    .catch(err => {
                        res.sendStatus(500)
                    })
            })
        })
    }
}

module.exports = {
    HuntingEndpoints: HuntingEndpoints
};