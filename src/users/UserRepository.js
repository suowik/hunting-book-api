let CRUD = require('../common/CRUD.js').CRUD;
let mDB = require('mongodb');

class UserRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'users',
            keyUniqueness: (entity) => {
                return {_id: entity._id}
            },
            beforeInsert: (user) => {
                console.log(user)
                if (user._id != null) {
                    user._id = new mDB.ObjectID(user._id)
                }
                if (user._id === null || user._id === undefined) {
                    user._id = new mDB.ObjectID()
                }
                if (!user.roles) {
                    user.roles = [];
                    user.roles.push('user');
                }
                console.log(user)
                return user
            }
        })
    }
}

module.exports = {
    UserRepository: UserRepository
};