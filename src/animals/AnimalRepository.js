let CRUD = require('../common/CRUD.js').CRUD;

class AnimalRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'animals',
            keyUniqueness: (entity) => {
                return {_id: entity._id}
            }
        })
    }
}

module.exports = {
    AnimalRepository: AnimalRepository
};