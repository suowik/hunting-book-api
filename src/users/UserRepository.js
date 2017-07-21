let CRUD = require('../common/CRUD.js').CRUD;

class UserRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'users',
            keyUniqueness: (entity) => {
                return {login: entity.login}
            },
            beforeInsert: (user => {
                user.roles= [];
                user.roles.push('user');
                return user

            })
        })
    }
}

module.exports = {
    UserRepository: UserRepository
};