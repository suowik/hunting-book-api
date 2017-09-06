let Endpoints = require('../common/Endpoints.js').Endpoints;
class HuntingEndpoints extends Endpoints {
    constructor(router, repository) {
        super(router, repository);
        this.routes = this.registerRoute((router, repository) => {
            router.get('/started/:userId', async (req, res) => {
                let huntings = await repository.findStartedHuntingsOfUser(req.params.userId);
                res.json(huntings)
            })
        });
        this.routes = this.registerRoute((router, repository) => {
            router.post('/finish', async (req, res) => {
                await repository.finish(req.body);
                res.sendStatus(200)
            })
        });
        this.routes = this.registerRoute((router, repository) => {
            router.post('/animals', async (req, res) => {
                await repository.addHuntedAnimals(req.body);
                res.sendStatus(200)
            })
        })
    }
}

module.exports = {
    HuntingEndpoints: HuntingEndpoints
};