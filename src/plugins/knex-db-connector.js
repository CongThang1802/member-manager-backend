const fastifyPlugin = require('fastify-plugin');
const knex = require('knex');
const {attachPaginate} = require('knex-paginate');
const { DB_CONNECTION,
    DB_HOST,
    DB_PORT,
    DB_DATABASE,
    DB_USERNAME,
    DB_PASSWORD,
} = process.env;

const knexConnector = async (app,options = {}) => {
    const db = knex({
        client: DB_CONNECTION,
        connection: {
            host: DB_HOST,
            user: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_DATABASE,
            port: DB_PORT,
            timezone: 'utc',
            ...options.connection
        },
        ...options
    })
    attachPaginate();

    app.decorate('knex', db);
}
module.exports = fastifyPlugin(knexConnector);