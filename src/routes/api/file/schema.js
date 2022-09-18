
const uploadSchema = {
    tags: ['Auth','File'],
    headers: {
        type: 'object',
        properties: {
            Authorization: {
                type: 'string',
                description: 'Bearer [token]'
            }
        },
        required: ['authorization']
    },
    consumes: ['multipart/form-data'],
    summary: 'Upload Image (avatar,...) - Cái này sử dụng Postman mới được ^^',
    description: 'Fields: { file: FileType }'
}
module.exports = {
    uploadSchema,
}