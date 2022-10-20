// importation des packages et des fichiers
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const log = require('./src/middlewares/log');
const blacklist = require('./src/middlewares/blacklist');

const app = express();

// middlewares
app.use(log);
app.use(cors());
app.use(bodyParser.json());
app.use(blacklist);

const PORT = 3001;

// routes
app.get('/', (req, res) => res.send("Connecté à l'API"));

// users : 
require('./src/routes/users/findOneUser')(app);
require('./src/routes/users/createUser')(app);
require('./src/routes/users/findAllUsers')(app);
require('./src/routes/users/updateUser')(app);
require('./src/routes/users/deleteUser')(app);

// login :
require('./src/routes/login')(app);

// swagger
require('./src/utils/swagger-serv')(app);


// Gestion d'erreur
// Erreur 404
app.use(({res}) => {
    const message = "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
    res.status(404).json({message});
})

app.listen(PORT, () => console.log(`Server running on ${PORT}!`));