const multer = require('multer');

const { models } = require('../sequelize');

const storage = multer.diskStorage({
    destination : function (req, file, callback) {
        callback(null,'./uploads/');
    },
    filename : function (req ,file, callback) {
        callback(null, new Date().toISOString() + file.originalname);
    }
});

const fileFilter = (req, file, callback) => {

    if (file.mimetype ==='image/jpeg' || file.mimetype ==='image/png' || file.mimetype ==='image/jpg') {
        const userInstance = models.user.build({
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            fname: req.body.fname,
            lname: req.body.lname,
        });

        userInstance.validate()
    .then( (data) => {
        callback(null,true);
    })
    .catch( (err) => {
        callback(err,false);
    });
        
        
    }
    else {
        callback(new Error('File is not an image'),false);
    }


    


};

const upload = multer({
    storage : storage,
    limits : {
        fileSize : 1024 * 1024 * 2,
    },
    fileFilter : fileFilter,
});

module.exports = upload.single('userImage');