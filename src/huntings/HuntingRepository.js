let CRUD = require('../common/CRUD.js').CRUD;
let mDB = require('mongodb');
let moment = require('moment');

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
                    "uniqueId": hunting.userId + "_" + hunting.start,
                    "area": hunting.area,
                    "huntedAnimals": hunting.huntedAnimals.map(a => {
                        return {"id": new mDB.ObjectID(a.id), "shots": a.shots, hunted: a.hunted}
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
                    "uniqueId": hunting.uniqueId,
                    "area": hunting.area[0],
                    "huntedAnimals": hunting.huntedAnimals.map(a => {
                        return {
                            "id": a.id,
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
                                $push: {
                                    huntedAnimals: {
                                        id: new mDB.ObjectID(animalsData.animal._id),
                                        shots: animalsData.animal.shots,
                                        name: animalsData.animal.name,
                                        hunted: animalsData.animal.hunted
                                    }
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

    findRelatedAnimal(animals, id) {
        return animals.filter(a => a._id.toString() === id.toString()).map(f => f.name)[0]
    }

}

module.exports = {
    HuntingRepository: HuntingRepository
};