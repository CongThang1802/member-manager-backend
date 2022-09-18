const lodash = require('lodash');
const fp = require('fastify-plugin');

module.exports = fp(function (app, opts, done) {
    app.decorate('lodash', lodash);

    done();
});