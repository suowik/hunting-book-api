let mongo = require('mongodb');
class Endpoints {
    constructor(router, repository) {
        this.routes = router;
        this.repository = repository;
        this.routes = this.registerRoute((router, repository) => {
            router.get('/', async (req, res) => {
                let result = await repository.findAll({
                    limit: parseInt(req.query.limit) || 100,
                    offset: parseInt(req.query.offset) || 0
                }, req.query);
                res.json(result)
            })
        });

        this.routes = this.registerRoute((router, repository) => {
            router.get('/:id', async (req, res) => {
                let result = await repository.find({_id: new mongo.ObjectID(req.params.id)});
                res.json(result);
            })
        });

        this.routes = this.registerRoute((router, repository) => {
            router.post('/', async (req, res) => {
                let entity = req.body;
                let created = await repository.create(entity);
                res.json(created);
            });
        });

        this.routes = this.registerRoute((router, repository) => {
            router.delete('/', async (req, res) => {
                let entity = req.body;
                await repository.remove({_id: new mongo.ObjectID(entity._id)});
                res.sendStatus(200)
            });
        });
    }

    registerRoute(endpoint) {
        endpoint(this.routes, this.repository);
        return this.routes
    }


}

module.exports = {
    Endpoints: Endpoints
};