const fp = require('fastify-plugin')
const niv = require('node-input-validator')
const WAValidator = require('multicoin-address-validator')
const { Validator } = niv


module.exports = fp(function (app, opts, done) {

    niv.extend('email', ({ value }, validator) => {
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        if (emailRegex.test(value)) {
            return true
        }
        return false
    })


    niv.extend('exist', async ({ value, args }) => {
        const field = args[1]
        let table = args[0], connection = 'knex'
        if (args[0].indexOf('.') >= 0) {
            const _split = args[0].split('.')
            table = _split[1]
            connection = _split[0]
        }
        if (!app.lodash.startsWith(connection, 'knex')) {
            connection = 'knex_' + connection
        }

        const queryBuilder = app[connection].select(field).from(table).where(field, value)
        let dataExist = await queryBuilder
        return dataExist.length > 0
    })

    niv.extend('unique', async ({ value, args }) => {
        const field = args[1]
        let table = args[0], connection = 'knex'
        if (args[0].indexOf('.') >= 0) {
            const _split = args[0].split('.')
            table = _split[1]
            connection = _split[0]
        }
        if (!app.lodash.startsWith(connection, 'knex')) {
            connection = 'knex_' + connection
        }

        const queryBuilder = app[connection].select(field).from(table)
        queryBuilder.where(field, value)
        // add ignore condition
        if (args[2] && args[3]) {
            queryBuilder.whereNot(args[2], args[3])
        } else if (args[2]) {
            queryBuilder.whereNot('id', args[2])
        }
        let dataExist = await queryBuilder
        // field value already exists
        return !dataExist.length
    })

    app.decorate('validate', (rules, type = 'body') => {
        return async (request, reply, next) => {
            let data = request[type]
            const _format_data = (data) => {
                if (typeof data === 'object' && app.lodash.isObject(data)) {
                    const returnData = {}
                    app.lodash.forEach(data, (v, k) => {
                        if (typeof k === 'string') {
                            const new_k = k.split('][').join('.').replace('[', '.').replace(']', '')
                            if (new_k !== k) {
                                if (typeof v === 'object') {
                                    v = _format_data(v)
                                }
                                app.lodash.set(returnData, new_k, v)
                            } else {
                                app.lodash.set(returnData, k, v)
                            }
                        } else {
                            app.lodash.set(returnData, k, v)
                        }
                    })
                    return returnData
                }
                return null
            }
            const newData = _format_data(data)
            if (newData && JSON.stringify(newData) !== JSON.stringify(data)) {
                request[type] = newData
            }
            const v = new Validator(newData, rules)
            const matched = await v.check()

            if (!matched) {

                const errors = []

                for (const error in v.errors) {
                    errors.push(app.lodash.extend({}, v.errors[error], { attribute: error }))
                }

                reply.send({
                    status: false,
                    code: app.code.VALIDATION,
                    msg: 'failed',
                    data: errors
                })
            }
            // next();
        }
    })



    done()
})
