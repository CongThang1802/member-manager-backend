const Fastify = require('fastify');
const AUTOLOAD = require('@fastify/autoload');
const path = require('path');
const { fastifySchedulePlugin } = require('@fastify/schedule')

const build = async () => {
    const app = Fastify({
        logger: false,
        ignoreTrailingSlash: true,
        trustProxy: true,
        maxParamLength: 255,
    });

    /*Schedule*/
    await app.register(fastifySchedulePlugin);
    /*Schedule*/


    await app.register(require('@fastify/cors'), {
        origin: '*',
    });
    await app.register(require('@fastify/jwt'), {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
    });
    await app.register(require('./plugins/knex-db-connector'), {});
    await app.register(require('@fastify/url-data'));
    await app.register(require('./plugins/response-code'));
    await app.register(require('./plugins/middleware'));
    await app.register(require('./plugins/validator'));


    await app.register(AUTOLOAD, {
        dir: path.join(__dirname, 'plugins/third_party'),
    });
    if (process.env.APP_ENV === 'local' || process.env.APP_ENV === 'test') {
        const docs = require('./docs');
        await app.register(require('@fastify/swagger'), docs);
    }

    await app.register(require('./routes/api'), { prefix: 'api' });
    app.addHook('onRequest', async (request, reply) => {
        const isMaintaince = parseInt(process.env.MAINTAINCE);
        if (isMaintaince) {
            reply.send({
                status: false,
                code: app.code.MAINTAINCE,
                msg: 'failed',
                data: [],
            });
            return;
        }
        return Promise.resolve()
    })

    app.addHook('onResponse', async (request, reply) => {
        if (request.currentWebhookQueue) {
            app.queueRequest.clearQueueFromWebhook(request.currentWebhookQueue)
        }
        return Promise.resolve()
    })
    return app;

};
module.exports = {
    build,
};


