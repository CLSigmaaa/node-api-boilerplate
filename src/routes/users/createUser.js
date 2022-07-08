const { checkToken } = require('../../auth/security');
const { User } = require('../../dbConfig/dbInit');
const bcrypt = require('bcrypt');

module.exports = (app) => {
    app.post('/api/user', checkToken(['admin']), (req, res) => {
        if(!req.body.password || !req.body.username){
            const message = "L'username ou le password ne peut pas être null";
            return res.status(401).json({message});
        }
        bcrypt.hash(req.body.password, 10).then(hash => {
            User.create({username: req.body.username, password: hash})
            .then(user => {
                const message = 'L\'utilisateur a été créé avec succès';
                res.json({message, data: user});
            })
            .catch(error => {
                const message = 'L\'utilisateur n\'a pas pu être créé. Réessayez dans quelques instants.';
                res.status(500).json({message, error});
            })
        })
    })
}