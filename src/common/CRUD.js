class CRUD {
    constructor(mongo, props) {
        this.mongo = mongo;
        this.props = props;
    }

    create(entity) {
        if (this.props.beforeInsert) {
            entity = this.props.beforeInsert(entity)
        }
        return this.exists(this.props.keyUniqueness(entity))
            .then((doc) => {
                if (!doc) {
                    return this.mongo
                        .then((db) => {
                            return db.collection(this.props.collection)
                                .insertOne(entity)
                        });
                }
                return Promise.reject(new Error('entity exists'));
            })
            .catch((err) => {
                return Promise.reject(err)
            })
    }

    remove(entity) {
        return this.mongo
            .then((db) => {
                return db.collection(this.props.collection)
                    .deleteMany(this.props.keyUniqueness(entity))
            });
    }

    exists(criteria) {
        return this.mongo
            .then(db => {
                return new Promise((resolve, reject) => {
                    db.collection(this.props.collection)
                        .findOne(criteria, (err, doc) => {
                            if (err) reject(err);
                            resolve(doc)
                        })
                });
            })
    }

    find(criteria) {
        return this.mongo
            .then((db) => {
                return new Promise((resolve, reject) => {
                    let partialQuery = db.collection(this.props.collection);
                    if (this.props.lookupQuery) {
                        this.props.lookupQuery(partialQuery).toArray((err, items) => {
                            if (err) reject(err);
                            resolve(items.map(e => this.props.afterFind(e))[0])
                        })
                    } else {
                        partialQuery.findOne(criteria, (err, doc) => {
                            if (err) reject(err);
                            if (this.props.afterFind) {
                                resolve(this.props.afterFind(doc))
                            }
                            resolve(doc);
                        })
                    }
                })
            })
    }

    findAll(pagination) {
        return this.mongo
            .then((db) => {
                return new Promise((resolve, reject) => {
                    let partialQuery = db.collection(this.props.collection);
                    if (this.props.lookupQuery) {
                        partialQuery = this.props.lookupQuery(partialQuery)
                    } else {
                        partialQuery = partialQuery.find()
                    }
                    if (pagination) {
                        let page = (pagination.offset / pagination.limit);
                        partialQuery
                            .skip(page * pagination.limit)
                            .limit(pagination.limit)
                    }
                    partialQuery.toArray((err, items) => {
                        if (err) reject(err);
                        if (this.props.afterFind) {
                            resolve(items.map(e => this.props.afterFind(e)))
                        }
                        resolve(items)
                    })
                })

            })
    }
}

module.exports = {
    CRUD: CRUD
};