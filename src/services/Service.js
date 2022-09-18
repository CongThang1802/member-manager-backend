
class Service {
    constructor(app) {
        this.app = app;
    }

    getRepository(repository) {
        repository = require('../repositories/' + repository);

        return new repository(this.app);
    }

    getResponse({status, code, msg, data}) {
        return {status, code, msg, data}
    }

    getErrorCode(code) {
        return this.app.code[code];
    }





}

module.exports = Service;