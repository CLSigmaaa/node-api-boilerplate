const { checkToken } = require('../../auth/security');
const { User } = require('../../dbConfig/dbInit');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const privateKey = require('../../auth/SECRET_KEY');

module.exports = (app) => {
    app.put('/api/user', checkToken(['student']), (req, res) => {
        const authorizationHeader = req.headers['authorization'];
        const token = authorizationHeader && authorizationHeader.split(' ')[1];
        jwt.verify(token, privateKey, (error, decodedToken) => {
            if(error) {
                const message = "L'utilisateur n'est pas autorisé à accéder à cette ressource.";
                return res.status(401).json({message: message, data: error});
            }

            const userId = decodedToken.userId;
            User.findOne({ where: { id: userId } }).then(user => {
                if(user.isFirstConnection){
                    user.update({isFirstConnection: false})
                    bcrypt.hash(req.body.password, 10).then(hash => {
                        User.update({password: hash}, {where: {id: userId}})
                        .then(user => {
                            const message = "Le mot de passe a été mis à jour.";
                            return res.json({message, data: user});
                        })
                        .catch(error => {
                            const message = "Le mot de passe n'a pas pu être mis à jour.";
                            return res.status(500).json({message, error});
                        })
                    })
                } else {
                    const message = "Ce n'est pas la première connexion de l'utilisateur.";
                    res.status(401).json({message: message});
                }
            }).catch(error => {
                const message = "L'utilisateur n'existe pas.";
                res.status(404).json({message: message})
            })
        })
    })
}