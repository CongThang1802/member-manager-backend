const fp = require("fastify-plugin");
const UserService = require("../services/UserService");

function middleware(app, opts, done) {
    const userService = new UserService(app);
    app.decorate('authenticated', async (request, reply, next) => {
        let token = request.headers.authorization ? request.headers.authorization.split(' ') : null;
        token = token && token[1] ? token[1] : null;
        if (!token) {
            reply.send({
                status: false,
                code: app.code.AUTHENTICATED,
                msg: 'failed',
                data: [],
            });
            return;
        }
        try {
            await request.jwtVerify();
            let {user} = request;
            request.user = user;
        } catch (e) {
            reply.send({
                status: false,
                code: app.code.AUTHENTICATED,
                msg: 'failed',
                data: [],
            });
        }
    });
    app.decorate(
        "detect_spam",
        function (
            config = {
                max: 5,
                seconds: 60,
                block_ip: false,
                block_user: false,
            }
        ) {
            return async (request, reply, next) => {

            };
        }
    );
    done();
}


module.exports = fp(middleware)
