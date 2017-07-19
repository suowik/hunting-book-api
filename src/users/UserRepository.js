class UserRepository {
    constructor(mongo) {
        this.mongo = mongo
    }

    create(user) {
        return this.userExists(user)
            .then((doc) => {
                if (!doc) {
                    return this.mongo
                        .then((db) => {
                            return db.collection('users')
                                .insertOne(user)
                        });
                }
                return Promise.reject(new Error('user exists'));
            })
            .catch((err) => {
                return Promise.reject(err)
            })


    }

    userExists(user) {
        return this.find({login: user.login})
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
                    db.collection('users')
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
                    let partial = db.collection('users')
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
    UserRepository: UserRepository
};