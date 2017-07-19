let endpoints = (router, repository) => {
    let all = router.get('/all', (req, res) => {
        repository.findAll()
            .then(users => {
                res.json(users);
            })
            .catch(err => {
                res.send(err)
            })
    });
    let register = router.post('/register', (req, res) => {

    });
    return router
};

module.exports = {
    userEndpoints: endpoints
};