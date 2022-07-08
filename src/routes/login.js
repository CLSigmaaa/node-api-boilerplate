const { User } = require('../dbConfig/dbInit')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/SECRET_KEY')

module.exports = (app) => {
  app.post('/api/login', (req, res) => {
    if(!req.body.password || !req.body.username){
      const message = "L'username ou le password ne peut pas être null";
      return res.status(401).json({message});
  }
    User.findOne({ where: { username: req.body.username } }).then(user => {
      bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
        if(!isPasswordValid) {
          const message = `Informations de connexion incorrectes.`;
          return res.status(401).json({message});
        }
        const token = jwt.sign({ userId: user.id }, privateKey, { expiresIn: '24h' });
        const message = `Connexion réussie.`;
        return res.json({message, data: token, isFirstConnection: user.isFirstConnection});
      })
    }).catch(error => {
        const message = "L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.";
        return res.json({message: message, data: error});
    })
  })
}