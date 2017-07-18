let userRoutes = (router, repository) => {
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
    router.use('/users', all);
    router.use('/users', register);
    return router
};

module.exports = {
    userRoutes: userRoutes
};