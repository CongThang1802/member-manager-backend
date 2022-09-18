const _ = require('lodash')
const response = (properties, description) => {
    return {
        description,
        type: 'object',
        properties: {
            status: {type: 'boolean'},
            code: {type: 'number'},
            msg: {type: 'string'},
            data: {
                type: 'array',
                items: {
                    type: 'object',
                    properties
                }
            }
        }
    };
};
module.exports = {
    responseSuccessCode(properties, description = '') {
        return response(properties, description)
    }
}