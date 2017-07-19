let CRUD = require('../common/CRUD.js').CRUD;

class AnimalRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'animals',
            keyUniqueness: (entity) => {
                return {name: entity.name}
            }
        })
    }
}

module.exports = {
    AnimalRepository: AnimalRepository
};