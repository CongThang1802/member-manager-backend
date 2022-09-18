const Repository = require('./Repository');

class DonateRepository extends Repository {
    constructor(app) {
        super(app);
        this.table = 'donate';
    }
}

module.exports = DonateRepository;