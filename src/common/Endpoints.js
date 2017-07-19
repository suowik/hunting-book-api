let mongo = require('mongodb');
class Endpoints {
    constructor(router, repository) {
        this.routes = router;
        this.repository = repository;
        this.routes = this.registerRoute((router, repository) => {
            router.get('/', (req, res) => {
                repository.findAll({limit: parseInt(req.query.limit) || 100, offset: parseInt(req.query.offset) || 0})
                    .then(result => {
                        res.json(result);
                    })
                    .catch(err => {
                        res.send(err)
                    })
            })
        });

        this.routes = this.registerRoute((router, repository) => {
            router.get('/:id', (req, res) => {
                repository.find({_id: new mongo.ObjectID(req.params.id)})
                    .then(result => {
                        res.json(result);
                    })
                    .catch(err => {
                        res.send(err)
                    })
            })
        });

        this.routes = this.registerRoute((router, repository) => {
            router.post('/', (req, res) => {
                let entity = req.body;
                repository.create(entity)
                    .then(() => {
                        res.json(entity)
                    })
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(409);
                    });
            });
        });

        this.routes = this.registerRoute((router, repository) => {
            router.delete('/', (req, res) => {
                let entity = req.body;
                repository.remove({_id: new mongo.ObjectID(entity._id)})
                    .then(() => {
                        res.sendStatus(200)
                    })
                    .catch(() => {
                        res.sendStatus(500);
                    });
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