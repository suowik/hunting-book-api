class CRUD {
    constructor(mongo, props) {
        this.mongo = mongo;
        this.props = props;
    }

    async create(entity) {
        if (this.props.beforeInsert) {
            entity = this.props.beforeInsert(entity)
        }
        let collection = await this.connect();
        let document = await collection.findAndModify(this.props.keyUniqueness(entity), [], entity, {upsert: true});
        return document.value;
    }

    remove(entity) {
        return this.mongo
            .then((db) => {
                return db.collection(this.props.collection)
                    .deleteMany(this.props.keyUniqueness(entity))
            });
    }

    async find(criteria) {
        let partialQuery = await this.connect();
        if (this.props.lookupQuery) {
            let items = await this.props.lookupQuery(partialQuery).toArray();
            return items.map(e => this.props.afterFind(e))[0]
        } else {
            let found = await partialQuery.findOne(criteria);
            if (this.props.afterFind) {
                return this.props.afterFind(found)
            }
            return found
        }
    }

    async findAll(pagination, criteria) {
        if (this.props.beforeSearch) {
            criteria = this.props.beforeSearch(criteria || {});
        }
        let partialQuery = await this.connect();
        if (this.props.lookupQuery) {
            partialQuery = await this.props.lookupQuery(partialQuery, criteria)
        } else {
            partialQuery = await partialQuery.find(criteria)
        }
        if (pagination) {
            let page = (pagination.offset / pagination.limit);
            partialQuery
                .skip(page * pagination.limit)
                .limit(pagination.limit)
        }
        let items = await partialQuery.toArray();
        if (this.props.afterFind) {
            return items.map(e => this.props.afterFind(e))
        }
        return items
    }

    async connect() {
        let db = await this.mongo;
        return db.collection(this.props.collection)
    }
}

module.exports = {
    CRUD: CRUD
};