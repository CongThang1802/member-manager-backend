const Repository = require('./Repository');

class UserRepository extends Repository {
    constructor(app) {
        super(app);
        this.table = 'users';
    }
}

module.exports = UserRepository;