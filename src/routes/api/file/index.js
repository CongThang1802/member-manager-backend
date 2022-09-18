const FileController = require('./controller');
const {uploadSchema} = require('./schema');
const {uploadRules} = require('./validation');
const MustImageError = require('./../../../exceptions/MustImageError');

const multer = require('fastify-multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../../../../public/uploads')
    },
    filename: function (req, file, cb) {
        const filename = Date.now() + file.originalname;
        req.filename = filename;
        cb(null, filename);
    }
})

const upload = multer({
    storage,
    limits: {
        fields: 1,
        fileSize: 5000000
    },
    fileFilter: function (request, file, cb) {
        try {
            if (file.mimetype.includes('image/')) {
                const pass = {
                    'jpg': true,
                    'png': true,
                    'jpeg': true,
                    'svg': true,
                };
                const arr = file.originalname.split('.');
                const extension = arr[arr.length - 1];
                if (pass[extension] !== undefined) {
                    cb(null, true)
                } else cb(new MustImageError(JSON.stringify(file)));
            } else {
                cb(new MustImageError(JSON.stringify(file)));
            }
        } catch (e) {
            cb(new MustImageError(JSON.stringify(file)));
        }
    }
});

const fileRoutes = async (app) => {
    const fileController = FileController(app);
    app.register(multer.contentParser);
    app.post('/upload', {
        schema: uploadSchema,
        preHandler: [app.authenticated, app.detect_spam(), app.validate(uploadRules), upload.single('file')]
    }, fileController.upload);

}

module.exports = fileRoutes;