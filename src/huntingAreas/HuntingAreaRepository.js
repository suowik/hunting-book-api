let CRUD = require('../common/CRUD.js').CRUD;

class HuntingAreaRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'huntingAreas',
            keyUniqueness: (entity) => {
                return {name: entity.name}
            }
        })
    }
}

module.exports = {
    HuntingAreaRepository: HuntingAreaRepository
};