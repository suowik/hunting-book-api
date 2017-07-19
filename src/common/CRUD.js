class CRUD {
    constructor(mongo, props) {
        this.mongo = mongo;
        this.props = props;
    }

    create(entity) {
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

    delete(entity) {
        return this.mongo
            .then((db) => {
                return db.collection(this.props.collection)
                    .deleteMany(this.props.keyUniqueness(entity))
            });
    }

    exists(criteria) {
        return this.find(criteria)
            .then((doc) => {
                return Promise.resolve(doc)
            }).catch(err => {
                return Promise.reject(err)
            });
    }

    find(criteria) {
        return this.mongo
            .then((db) => {
                return new Promise((resolve, reject) => {
                    db.collection(this.props.collection)
                        .findOne(criteria, (err, doc) => {
                            if (err) reject(err);
                            resolve(doc);
                        });
                })
            })
    }

    findAll(pagination) {
        return this.mongo
            .then((db) => {
                return new Promise((resolve, reject) => {
                    let partial = db.collection(this.props.collection)
                        .find();
                    if (pagination) {
                        let page = (pagination.offset / pagination.limit);
                        partial
                            .skip(page * pagination.limit)
                            .limit(pagination.limit)
                    }
                    partial.toArray((err, items) => {
                        if (err) reject(err);
                        resolve(items)
                    })
                })

            })
    }
}

module.exports = {
    CRUD: CRUD
};