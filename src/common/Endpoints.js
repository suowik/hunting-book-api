class Endpoints {
    constructor(router, repository) {
        this.routes = router;
        this.repository = repository;
        this.routes = this.registerRoute((router, repository) => {
            router.get('/', (req, res) => {
                repository.findAll({limit: parseInt(req.query.limit) || 5, offset: parseInt(req.query.offset) || 0})
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
                repository.delete(entity)
                    .then(() => {
                        res.sendStatus(200)
                    })
                    .catch((err) => {
                        console.log(err);
                        res.sendStatus(409);
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