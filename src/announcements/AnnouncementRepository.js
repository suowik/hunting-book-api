let CRUD = require('../common/CRUD.js').CRUD;
let mDB = require('mongodb');


class AnnouncementRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'announcements',
            keyUniqueness: (entity) => {
                return {_id: entity._id}
            },
            beforeInsert: (announcement) => {
                if (announcement._id !== null) {
                    announcement._id = new mDB.ObjectID(announcement._id)
                }
                if (announcement._id === null || announcement._id === undefined) {
                    announcement._id = new mDB.ObjectID()
                }
                announcement.userId = new mDB.ObjectID(announcement.userId);
                return announcement
            },
            afterFind: (announcement) => {
                return {
                    "user": {
                        name: announcement.user[0].name,
                        surname: announcement.user[0].surname
                    },
                    "_id": announcement._id,
                    "content": announcement.content,
                    "announced": announcement.announced
                }
            },
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
        })
    }
}

module.exports = {
    AnnouncementRepository: AnnouncementRepository
};