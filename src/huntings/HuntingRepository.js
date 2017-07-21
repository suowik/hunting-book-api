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
                    "area": new mDB.ObjectID(hunting.area),
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