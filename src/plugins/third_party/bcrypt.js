const bcrypt = require('bcrypt');
const fp = require('fastify-plugin');

module.exports = fp(function (app, opts, done) {
    app.decorate('bcrypt', bcrypt);

    done();
});