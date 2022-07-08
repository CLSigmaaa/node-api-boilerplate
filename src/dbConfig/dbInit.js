// importation des modules
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user');

// initialisation de la connexion à la base de données
const sequelize = new Sequelize(
    'boilerplate',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mariadb',
        logging: false,
    }
)

// initialisation des models
sequelize.authenticate()
    .then(_ => console.log('Connection à la base de données réussie'))
    .catch(error => console.error('Erreur lors de la connection à la base de données : ', error));

// initialisation des models
const User = UserModel(sequelize, DataTypes);

// Ajout de données dans la base de données
sequelize.sync({ force: true })
    .then(_ => {
        console.log("Base de données synchronisée");

        bcrypt.hash('pass', 10)
        .then(hash => {
            User.create({
                username: 'guest',
                password: hash,
                role: 'student'
            }).then(user => console.log(user.toJSON()))
        })
        bcrypt.hash('pass', 10)
        .then(hash => {
            User.create({
                username: 'admin',
                password: hash,
                role: 'admin'
            }).then(user => console.log(user.toJSON()))
        })
    })

// export des models
module.exports = {
    User
}