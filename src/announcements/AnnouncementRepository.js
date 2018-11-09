let CRUD = require('../common/CRUD.js').CRUD;
let mDB = require('mongodb');


class AnnouncementRepository extends CRUD {
    constructor(mongo) {
        super(mongo, {
            collection: 'announcements',
            keyUniqueness: (entity) => {
                return {_id: entity._id}
            },
            beforeInsert: (announcement)=>{
                if (announcement._id !== null) {
                    announcement._id = new mDB.ObjectID(announcement._id)
                }
                if (announcement._id === null || announcement._id === undefined) {
                    announcement._id = new mDB.ObjectID()
                }
                return announcement
            }
        })
    }
}

module.exports = {
    AnnouncementRepository: AnnouncementRepository
};