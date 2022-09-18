const fp = require('fastify-plugin');
const momentTz = require('moment-timezone');

module.exports = fp(function (app, opts, done) {
    const moment_ = momentTz.tz.setDefault('UTC');
    app.decorate('moment', moment_);
    done();
});