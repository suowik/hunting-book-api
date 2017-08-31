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
            lookupQuery: (collection, criteria) => {
                return collection.aggregate([
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
                if(criteria.userId){
                    criteria.userId = new mDB.ObjectID(criteria.userId)
                }
                return criteria
            }
        })
    }

    finish(finishData) {
        return this.mongo
            .then(db => {
                return new Promise((resolve, reject) => {
                    let huntings = db.collection(this.props.collection);
                    huntings
                        .findAndModify(
                            {_id: new mDB.ObjectID(finishData._id)},
                            [],
                            {
                                $set: {
                                    'status': 'finished',
                                    'end': finishData.end
                                }
                            },
                            {upsert: true},
                            (err, doc) => {
                                if (err) reject(err);
                                resolve(doc)
                            })
                })
            })
    }

    addHuntedAnimals(animalsData) {
        return this.mongo
            .then(db => {
                return new Promise((resolve, reject) => {
                    let huntings = db.collection(this.props.collection);
                    huntings
                        .findAndModify(
                            {_id: new mDB.ObjectID(animalsData._id)},
                            [],
                            {
                                $set: {
                                    huntedAnimals: animalsData.animals
                                }
                            },
                            {upsert: true},
                            (err, doc) => {
                                if (err) reject(err);
                                resolve(doc)
                            })
                })
            })
    }

    findStartedHuntingsOfUser(userId) {
        let criteria = {
            userId: new mDB.ObjectID(userId),
            status: 'started'
        };
        return this.mongo
            .then(db => {
                return new Promise((resolve, reject) => {
                    db.collection(this.props.collection)
                        .find(criteria, [{_id: true}])
                        .toArray((err, res) => {
                            if (err) reject(err);
                            resolve(res)
                        })
                })
            })
    }

}

module.exports = {
    HuntingRepository: HuntingRepository
};