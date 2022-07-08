const { checkToken } = require('../../auth/security');
const { User } = require('../../dbConfig/dbInit');

module.exports = (app) => {
    app.put('/api/user/reset/:id', (req, res) => {
        User.update({isFirstConnection: true}, {where: {id: req.params.id}})
            .then(user => {
                const message = 'Le compte a été réinitialisé avec succès';
                res.json({message, data: user});
            }).catch(error => {
                const message = 'Le compte n\'a pas pu être réinitialisé. Réessayez dans quelques instants.';
                res.status(500).json({message, error});
            }
        )
    })
}