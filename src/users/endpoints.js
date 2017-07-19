let endpoints = (router, repository) => {
    router.route('/')
        .get((req, res) => {
            repository.findAll({limit: parseInt(req.query.limit) || 5, offset: parseInt(req.query.offset) || 0})
                .then(users => {
                    res.json(users);
                })
                .catch(err => {
                    res.send(err)
                })
        })
        .post((req, res) => {
            let user = req.body;
            repository.create(user)
                .then(() => {
                    res.json(user)
                })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(409);
                });
        });
    return router
};

module.exports = {
    userEndpoints: endpoints
};