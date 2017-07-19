class UserRepository {
    constructor(mongo) {
        this.mongo = mongo
    }

    create(user) {
        return this.mongo
            .then((db) => {
                return db.collection('users')
                    .insert(user)
            });
    }

    findOne(name) {
        return new Promise((resolve, reject) => {
            resolve({password: 'abc', name: 'name'})
        })
    }

    findAll() {
        return this.mongo
            .then((db) => {
                return new Promise((resolve, reject) => {
                    db.collection('users')
                        .find()
                        .toArray((err, items) => {
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