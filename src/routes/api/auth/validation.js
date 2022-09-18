module.exports = {
    loginRules: {
        email: 'required|email|minLength:6|maxLength:50',
        password: 'required|minLength:8|maxLength:50',
    },
    registerRules: {
        email: 'required|email|minLength:6|maxLength:50',
        full_name: 'required|minLength:6|maxLength:50',
        password: 'required|minLength:8|maxLength:50',
    },
    changeRules: {
        email: 'required|email|minLength:6|maxLength:50',
        new_password: 'required|minLength:8|maxLength:50',
        password: 'required|minLength:8|maxLength:50',
    },
}