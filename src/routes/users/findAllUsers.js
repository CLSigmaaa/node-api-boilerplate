const { User } = require('../../dbConfig/dbInit');
const { Op } = require('sequelize');
const { checkToken } = require('../../auth/security');

module.exports = (app) => {
    app.get('/api/users', checkToken(['admin']), (req, res) => {
        let filters = {};
        const limit = parseInt(req.query.limit) || 10;

        for (let key in req.query) {
            if (key !== 'limit') {
                filters[key] = req.query[key];
            }
        }

        if(req.query){
            for(let key in filters){
                filters[key] = {[Op.like]: '%' + filters[key] + '%'};
            }

            User.findAll({
                where: filters,
                limit: limit,
                order: ['createdAT']
            })
            .then(Users => {
                const message = `Il y a ${Users.length} Users trouvées selon vos critères de recherche.`;
                res.status(200).json({message, data: Users});
            })
            .catch(error => {
                const message = 'La User n\'a pas pu être récupérée. Réessayez dans quelques instants.';
                res.status(500).json({message, data: error});
            })
        } 
        else {
            User.findAll({ limit: limit, order: ['createdAT'] })
            .then(Users => {
                const message = 'La liste des Users a été récupérée avec succès';
                res.json({message, data: Users});
            })
            .catch(error => {
                const message = 'La liste des Users n\'a pas pu être récupérée. Réessayez dans quelques instants.';
                res.status(500).json({message, error});
            })
        }      
    })
}