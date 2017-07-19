let CRUD = require('../common/CRUD.js').CRUD;

class UserRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'users',
            keyUniqueness: (entity) => {
                return {login: entity.login}
            }
        })
    }
}

module.exports = {
    UserRepository: UserRepository
};