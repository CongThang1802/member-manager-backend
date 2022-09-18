
module.exports = function (app) {

    return {
        upload: async (request, reply) => {
            return {
                status: true,
                code: 0,
                msg: 'success',
                data: [
                    {
                        filename: request.filename
                    }
                ]
            }
        }
    }
}
