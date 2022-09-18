const UserController = require('./controller');
const { loginSchema, registerSchema, changePassSchema } = require('./schema');
const { loginRules, registerRules, changeRules } = require('./validation');
const authRoutes = async (app, options) => {

    const userController = UserController(app);
    app.post('/login', {
        schema: loginSchema,
        preValidation: [
            app.detect_spam(),
            app.validate(loginRules),
        ]
    }, userController.login);
    app.post('/register', {
        schema: registerSchema,
        preValidation: [
            app.validate(registerRules),
        ]
    }, userController.register);
    app.post('/change-password', {
        schema: changePassSchema,
        preValidation: [
            app.validate(changeRules),
        ]
    }, userController.changePassword);
};


module.exports = authRoutes;