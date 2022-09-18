const fp = require('fastify-plugin');
const code = require('../config/code');

function response_code(app, opts, next) {

    app.decorate('code', code);

    next();
}

module.exports = fp(response_code);