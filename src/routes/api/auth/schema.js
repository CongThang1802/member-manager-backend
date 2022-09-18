const tags = [
    'Auth'
]

const headers = {
    type: 'object',
    properties: {
        Authorization: {
            type: 'string',
            description: 'Bearer [token]'
        }
    },
    required: ['authorization']
}

const loginSchema = {
    tags,
    body: {
        type: 'object',
        properties: {
            email: {
                type: 'string'
            },
            password: {
                type: 'string'
            },
        },
        required: ['email', 'password']
    },
};
const registerSchema = {
    tags,
    body: {
        type: 'object',
        properties: {
            email: {
                type: 'string'
            },
            password: {
                type: 'string'
            },
            full_name: {
                type: 'string'
            },
        },
        required: ['email', 'password']
    },
};
const changePassSchema = {
    tags,
    body: {
        type: 'object',
        properties: {
            email: {
                type: 'string'
            },
            password: {
                type: 'string'
            },
            new_password: {
                type: 'string'
            },
        },
        required: ['email', 'password']
    },
};
module.exports = {
    loginSchema,
    registerSchema,
    changePassSchema
}
