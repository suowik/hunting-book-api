let CRUD = require('../common/CRUD.js').CRUD;

class HuntingRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'huntings',
            keyUniqueness: (entity) => {
                return {_id: entity._id}
            }
        })
    }
}

module.exports = {
    HuntingRepository: HuntingRepository
};