const Service = require('./Service');

class UserService extends Service {
    constructor(app) {
        super(app);
        this.userRepository = this.getRepository('UserRepository');
        this.DAYS_EXPIRES = 7;
    }

    async login({
                    email,
                    password,
                }) {
        try {
            const queryBuilder = this.userRepository
                .get({
                    email,
                })
                .first();
            let user = await queryBuilder;
            if (!user) {
                return [false, this.getErrorCode('USER_NOT_FOUND'), 'USER_NOT_FOUND'];
            }
            const expiresIn = this.app
                .moment()
                .add(this.DAYS_EXPIRES, 'days')
                .unix();
            if (this.app.bcrypt.compareSync(password, user.password)) {
                const token = this.app.jwt.sign({
                    ...{
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                    },
                    expiresIn,
                });
                const response = {
                    token: token,
                    expiresIn: expiresIn,
                    user: {
                        id: user.id,
                        email: user.email,
                        full_name: user.full_name,
                    },
                };
                return [true, 0, [response]];
            }
            return [false, this.getErrorCode('WRONG_PASSWORD'), 'WRONG_PASSWORD'];


        } catch (error) {
            return [false, 1000, []];
        }
    }

    async register({body}){
        try {
            const {full_name , email , password} = body
            const checkUser = await this.userRepository.get({email})
            if (checkUser) {
                return [false, this.getErrorCode('EMAIL_EXIST'), 'EMAIL_EXIST']
            }
            const salt = this.app.bcrypt.genSaltSync(10)

            const newPassword = this.app.bcrypt.hashSync(password, salt)
            const newUser = await this.userRepository.db().insert({full_name,email,password : newPassword})
            if (newUser) {
                return [true , 0, []]
            }
            return [false, this.getErrorCode('CAN_REGISTER'), 'CAN_REGISTER']

        }
        catch (e) {
            throw e
        }
    }
    async changePassword({body}){
        try {
            const {email , password , new_password} =body
            const checkUser = await this.userRepository.get({email}).first()
            if (!checkUser) {
                return [false , this.getErrorCode('USER_NOT_FOUND') , 'USER_NOT_FOUND']
            }
            if(this.app.bcrypt.compareSync(password, checkUser.password)){
                const salt = this.app.bcrypt.genSaltSync(10)
                const newPassword = this.app.bcrypt.hashSync(new_password, salt)
                const data = await this.userRepository.model().where({id}).update({password: newPassword})
                if (data){
                    return [true , 0, []]
                }
                return [false, this.getErrorCode('CAN_CHANGE_PASSWORD'), 'CAN_CHANGE_PASSWORD']
            }
            return [false ,this.getErrorCode('WRONG_PASSWORD'), 'WRONG_PASSWORD']
        }
        catch (e) {
            throw e
        }
    }

}

module.exports = UserService;
