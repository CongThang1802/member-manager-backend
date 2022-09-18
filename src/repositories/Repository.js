class Repository {
    constructor(app) {
        this.app = app;
        this.table = '';
        this.fillable = [];
        this.trx = null;
        this.connection = 'knex';
    }

    getConnection(table) {
        if (!this.app.lodash.startsWith(this.connection, 'knex')) {
            this.connection = 'knex_' + this.connection;
        }
        if (table) return this.app[this.connection](table);
        return this.app[this.connection];
    }

    db() {
        if (this.trx) return this.trx(this.table);
        return this.getConnection(this.table);
    }

    model() {
        return this.db();
    }

    setTransaction(trx) {
        this.trx = trx;
        return this;
    }

    transacting(trx) {
        return this.model().transacting(trx);
    }

    all() {
        return this.model();
    }

    /**
     *
     * @param args
     * @return {Knex.QueryBuilder}
     */
    get(...args) {
        let select = '*', is_fillable = false, where = {}, scope;

        if (typeof args[0] === "boolean") is_fillable = args[0];
        else if (typeof args[0] === "function") scope = args[0];
        else if (typeof args[0] === "object") where = args[0];
        else if (typeof args[0] === "object" && Array.isArray(args[0])) select = args[0];

        if (typeof args[1] === "boolean") is_fillable = args[1];
        else if (typeof args[1] === "function") scope = args[1];
        else if (typeof args[1] === "object") where = args[1];
        else if (typeof args[1] === "object" && Array.isArray(args[1])) select = args[1];

        if (typeof args[2] === "boolean") is_fillable = args[2];
        else if (typeof args[2] === "function") scope = args[2];
        else if (typeof args[2] === "object") where = args[2];
        else if (typeof args[2] === "object" && Array.isArray(args[2])) select = args[2];

        if (typeof args[3] === "boolean") is_fillable = args[3];
        else if (typeof args[3] === "function") scope = args[3];
        else if (typeof args[3] === "object") where = args[3];
        else if (typeof args[3] === "object" && Array.isArray(args[3])) select = args[3];

        if (is_fillable && select === '*') select = this.fillable;

        const queryBuilder = this.model().select(select);

        if (where && typeof where === "object") {
            queryBuilder.where(where);
        }
        if (scope && typeof scope === "function") {
            scope.call(null, queryBuilder);
        }
        if (this.table === 'wallet') {
            // console.log("this.table ", this.table)
            queryBuilder.where("is_deleted", 0)
        }
        return queryBuilder;
    }

    async getOneOrNull(...args) {

        const instance = await this.get(...args);

        if (instance.length > 0) {
            const [data] = instance;
            return data;
        }

        return null;
    }

    async getOneOrNull_v2(trx = null, args) {
        if (!trx) {
            return await this.getOneOrNull(args)
        }
        let instance;
        if (this.table === 'wallet') {
            instance = trx ? await this.transacting(trx).where(args).where("is_deleted", 0) : await this.get(args);
        } else {
            instance = trx ? await this.transacting(trx).where(args) : await this.get(args);
        }

        if (instance.length > 0) {
            const [data] = instance;
            return data;
        }

        return null;
    }

    async getOneVarOrNull(idField = 'id', ...args) {
        const instance = await this.get(...args).select([idField]);

        if (instance.length > 0) {
            const [data] = instance;
            return data[idField];
        }

        return null;
    }

    async getLastOneOrNull(orderField = 'created_at', ...args) {
        const instance = await this.get(...args).orderBy(orderField, 'DESC');

        if (instance.length > 0) {
            const [data] = instance;
            return data;
        }

        return null;
    }

    async update(body, where) {
        try {
            const __response = await this.getConnection().transaction(async trx => {
                await this.setTransaction(trx);
                const queryBuilder = this.transacting(trx);
                if (typeof where === "function") {
                    where.call(null, queryBuilder);
                } else if (typeof where !== "undefined") {
                    queryBuilder.where(where)
                }
                return queryBuilder.update(body);
            });

            await this.setTransaction(null);

            return __response;
        } catch (e) {

            // this.app.log_json.write('error', e);

            await this.setTransaction(null);

            throw e;
        }
    }

    async create(body) {
        try {
            const __response = await this.getConnection().transaction(async trx => {
                await this.setTransaction(trx);
                return this.transacting(trx).insert(body);
            });

            await this.setTransaction(null);

            return __response;
        } catch (e) {

            await this.setTransaction(null);

            throw e;
        }

    }
}

module.exports = Repository;