const Repository = require('./Repository');

class MemberRepository extends Repository {
    constructor(app) {
        super(app);
        this.table = 'member';
    }
}

module.exports = MemberRepository;