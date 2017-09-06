let CRUD = require('../common/CRUD.js').CRUD;
let mDB = require('mongodb');
let moment = require('moment');
let AnimalRepository = require('../animals/AnimalRepository.js').AnimalRepository;

class HuntingRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'huntings',
            keyUniqueness: (entity) => {
                return {
                    uniqueId: entity.userId + "_" + entity.start
                }
            },
            beforeInsert: (hunting => {
                return {
                    "userId": new mDB.ObjectID(hunting.userId),
                    "status": hunting.status,
                    "start": hunting.start,
                    "end": hunting.end,
                    "huntingSpot": hunting.huntingSpot,
                    "uniqueId": hunting.userId + "_" + hunting.start,
                    "huntedAnimals": hunting.huntedAnimals.map(a => {
                        return {"_id": a._id, "shots": a.shots, hunted: a.hunted}
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
                    "huntingSpot": hunting.huntingSpot,
                    "uniqueId": hunting.uniqueId,
                    "huntedAnimals": hunting.huntedAnimals.map(a => {
                        return {
                            "_id": a._id,
                            "shots": a.shots,
                            "hunted": a.hunted,
                            "name": a.name
                        }
                    })
                }
            }),
            lookupQuery: async (collection, criteria) => {
                return await collection.aggregate([
                    {$match: criteria},
                    {
                        "$lookup": {
                            "from": "users",
                            "localField": "userId",
                            "foreignField": "_id",
                            "as": "user"
                        }
                    }
                ])
            },
            beforeSearch: (criteria) => {
                if (criteria.userId) {
                    criteria.userId = new mDB.ObjectID(criteria.userId)
                }
                return criteria
            }
        })
    }

    async finish(finishData) {
        let collection = await super.connect();
        return await collection.findAndModify(
            {_id: new mDB.ObjectID(finishData._id)},
            [],
            {
                $set: {
                    'status': 'finished',
                    'end': finishData.end
                }
            },
            {upsert: true});
    }

    async addHuntedAnimals(animalsData) {
        let collection = await super.connect();
        return await collection.findAndModify(
            {_id: new mDB.ObjectID(animalsData._id)},
            [],
            {
                $set: {
                    huntedAnimals: animalsData.animals
                }
            },
            {upsert: true});
    }

    async findStartedHuntingsOfUser(userId) {
        let criteria = {
            userId: new mDB.ObjectID(userId),
            status: 'started'
        };
        let collection = await super.connect();
        let items = await collection.find(criteria, [{_id: true}]);
        return await items.toArray();
    }

}

module.exports = {
    HuntingRepository: HuntingRepository
};