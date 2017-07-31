let CRUD = require('../common/CRUD.js').CRUD;

class HuntingAreaRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'huntingAreas',
            keyUniqueness: (entity) => {
                return {_id: entity._id}
            }
        })
    }
}

module.exports = {
    HuntingAreaRepository: HuntingAreaRepository
};