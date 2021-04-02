const multer = require('multer');

const type = (file) => {
    if (file.mimetype === 'image/png'){
        return '.png';
    } else if (file.mimetype === 'image/jpeg') {
        return '.jpeg';
    } else if (file.mimetype === 'image/jpg') {
        return '.jpg';
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/public/images/');
    },
    filename: (req, file, cb) => {
        cb(null,  file.fieldname + '-' + Date.now() + type(file));
    }
});

const uploader = multer ({
    storage: storage,
    destination: '../images',
    limit: {
        fileSize: 2 * 512 * 512
    },
    filename: (req, file, cb) => {
        cb(null,  file.fieldname + '-' + Date.now() + '.' + type(file.mimetype));
    },
    fileFilter (req, file, cb) {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg') {
            cb(null, true)
        } else (
            cb(null, false)
        )
    }
});


module.exports = uploader;