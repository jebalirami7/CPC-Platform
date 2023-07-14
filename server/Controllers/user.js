const { models } = require('../sequelize');
const { unlink } = require('node:fs/promises');



async  function deletefile(path) {
    try {
      await unlink(path);
      console.log(`successfully deleted ${path}`);
    } catch (error) {
      console.error('there was an error:', error.message);
    }
  };



exports.createUser = (req, res, next) => {
    models.user.create({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,

    })
        .then((data) => {
            res.status(201).json({
                message: "Create Successful",
            });
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            });
        });
};



exports.deleteUser = async (req, res, next) => {

    const userId = req.params.id;
    try {
        const user = await models.user.findByPk(userId);
        if (!user) {
            return res.status(404).json(
                {
                    error: 'User not found'
                });
        }

        await models.user.destroy(
            {
                where: {
                    id_user: userId
                }
            });
        if (user.imagePath !== '../img/profile.jpg') {
            deletefile(user.imagePath);
        }
        

        return res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (err) {
        return res.status(500).json({ error: err });
    }

};


exports.updateUser =  (req, res, next) => {

    const userId = req.params.id;
    const updatedFields = {} ;

    for (const [key,val]of Object.entries(req.body)) {
        updatedFields[key] = val;
    }

    if (req.file) {
        updatedFields["imagePath"] = req.file.path ;
    }
    else {
        delete updatedFields.imagePath ;
    }

    models.user.update(updatedFields,
    {
        where : {
            id_user : req.params.id,
        },
        individualHooks: true,

    })
    .then( (data) => {

        if (data[0] == 0 ) {
            return res.status(404).json(
                {
                    error: 'User not found'
                });
        }
        else {
            if ( req.file && data[1][0]['_previousDataValues']['imagePath'] !== '../img/profile.jpg') {
                deletefile(data[1][0]['_previousDataValues']['imagePath']);
            }

            return res.status(200).json(
                { message: 'Update successful' 
            });
        }
    })
    .catch ((err) => {
        return res.status(500).json({ error: err });
    }
    );
};