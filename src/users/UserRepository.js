let CRUD = require('../common/CRUD.js').CRUD;
let mDB = require('mongodb');
class UserRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'users',
            keyUniqueness: (entity) => {
                return {_id: entity._id}
            },
            beforeInsert: (user => {
                if (user._id) {
                    user._id = new mDB.ObjectID(user._id)
                }
                if (!user.roles) {
                    user.roles = [];
                    user.roles.push('user');
                }
                return user

            })
        })
    }
}

module.exports = {
    UserRepository: UserRepository
};