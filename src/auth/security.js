// importation des modules
const jwt = require('jsonwebtoken');
const privateKey = require('./SECRET_KEY');
const { User } = require('../dbConfig/dbInit');

// middleware de sécurité
const checkToken = (allowedRoles) => {
    return (req, res, next) => {
        //récupération du token
        const authorizationHeader = req.headers['authorization'];

        if(!authorizationHeader) {
            return res.status(401).json({message: 'Aucun token n\'a été fourni.'});
        }

        const token = authorizationHeader && authorizationHeader.split(' ')[1];
        // vérification du token
        jwt.verify(token, privateKey, (error, decodedToken) => {
            if(error) {
                const message = "L'utilisateur n'est pas autorisé à accéder à cette ressource.";
                return res.status(401).json({message: message, data: error});
            }
            // récupération de l'utilisateur et autorisation ou refus
            const userId = decodedToken.userId;
            User.findOne({ where: { id: userId } }).then(user => {
                if(!allowedRoles.includes(user.role)) {
                    const message = "L'utilisateur n'est pas autorisé à accéder à cette ressource.";
                    return res.status(401).json({message: message});
                } else {
                    next();
                }
            }).catch(error => {
                const message = "L'utilisateur n'existe pas.";
                return res.status(404).json({message: message})
            })
        })
        next();
    }
}

// exportation du middleware
module.exports = {
    checkToken
}