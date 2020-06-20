const multer = require('multer');
const multerGoogleStorage = require("multer-google-storage");
const { sendResponse } = require('../helpers/ResponseHelper');

module.exports = () => async (req, res, next) => {
    try {
        if (req.method === 'POST' || req.method === 'PUT') {
            const user = req.body.user;
            const upload = multer({
                storage: multerGoogleStorage.storageEngine(),
                fileFilter(req, file, cb) {
                    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
                        return cb(new Error("File format not supported"));
                    }
                    cb(undefined, true);
                }
            }).single('image');

            upload(req, res, (err) => {
                if (err) {
                    next(err);
                }
                req.body.user = user;
                if (req.file) {
                    req.body.path = req.file.filename;
                    next()
                } else {
                    next();
                }
            });

        } else {
            sendResponse(res, 203);
        }
    } catch (e) {
        sendResponse(res, 500);
    }
};
