const { checkToken } = require('../../auth/security');
const { User } = require('../../dbConfig/dbInit');

module.exports = (app) => {
    app.delete('/api/user/:id', (req, res) => {
        return User.findByPk(parseInt(req.params.id)).then(user => {
            if(user === null){
                const message = 'La user n\'existe pas';
                return res.status(404).json({message});
            }
            const message = 'La user a été supprimée avec succès';
            return User.destroy({
                where: { id: req.params.id }
            })
            .then(_ => {
                const message = 'La user a été supprimée avec succès';
                res.json({message, data: user});
            })
        })
        .catch(error => {
            const message = 'La user n\'a pas pu être supprimée. Réessayez dans quelques instants.';
            res.status(500).json({message, error});
        })
    })
}