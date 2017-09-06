let jwt = require('jsonwebtoken');

let authorizationFilter = (secret) => {
    return (req, res, next) => {
        const token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    return res.json({success: false, message: 'Failed to authenticate token.'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
};

let loginHandler = (secret, userRepository) => {
    return async (req, res) => {
        let user = await userRepository.find({login: req.body.login});
        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found.'});
        } else if (user) {
            if (user.password !== req.body.password) {
                res.json({success: false, message: 'Authentication failed. Wrong password.'});
            } else {
                res.json({
                    success: true,
                    roles: user.roles,
                    userId: user._id,
                    active: user.active,
                    token: jwt.sign(user, secret, {
                        expiresIn: 60 * 60
                    })
                });
            }
        }
    }
};

module.exports = {
    authorizationFilter: authorizationFilter,
    loginHandler: loginHandler
};