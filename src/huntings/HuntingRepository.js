let CRUD = require('../common/CRUD.js').CRUD;
let m = require('mongodb');

class HuntingRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'huntings',
            keyUniqueness: (entity) => {
                return {_id: entity._id}
            },
            beforeInsert: (hunting => {
                return {
                    "userId": new m.ObjectID(hunting.userId),
                    "status": hunting.status,
                    "start": hunting.start,
                    "end": hunting.end,
                    "area": new m.ObjectID(hunting.area),
                    "huntedAnimals": hunting.huntedAnimals.map(a => {
                        return {"id": new m.ObjectID(a.id), "shots": a.shots, hunted: a.hunted}
                    })
                }
            }),
            afterFind: (hunting => {
                return {
                    "user": hunting.user[0],
                    "status": hunting.status,
                    "start": hunting.start,
                    "end": hunting.end,
                    "_id": hunting._id,
                    "area": hunting.area[0],
                    "huntedAnimals": hunting.huntedAnimals.map(a => {
                        return {
                            "id": a.id,
                            "shots": a.shots,
                            "hunted": a.hunted,
                            "name": this.findRelatedAnimal(hunting.animals, a.id)
                        }
                    })
                }
            }),
            lookupQuery: (collection) => {
                return collection.aggregate([
                    {
                        "$lookup": {
                            "from": "huntingAreas",
                            "localField": "area",
                            "foreignField": "_id",
                            "as": "area"
                        }
                    },
                    {
                        "$lookup": {
                            "from": "animals",
                            "localField": "huntedAnimals.id",
                            "foreignField": "_id",
                            "as": "animals"
                        }
                    },
                    {
                        "$lookup": {
                            "from": "users",
                            "localField": "userId",
                            "foreignField": "_id",
                            "as": "user"
                        }
                    }
                ])
            }
        })
    }

    findRelatedAnimal(animals, id) {
        return animals.filter(a => a._id.toString() === id.toString()).map(f => f.name)[0]
    }
}

module.exports = {
    HuntingRepository: HuntingRepository
};