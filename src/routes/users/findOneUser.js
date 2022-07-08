const { User } = require('../../dbConfig/dbInit');
const { checkToken } = require('../../auth/security');

module.exports = (app) => {
    app.get('/api/user/:id', checkToken(['admin']), (req, res) => {
        User.findByPk(req.params.id)
            .then(User => {
                const message = 'La User a été récupérée avec succès';
                res.json({message, data: User});
            })
            .catch(error => {
                const message = 'La User n\'a pas pu être récupérée. Réessayez dans quelques instants.';
                res.status(500).json({message, error});
            })
    })
}