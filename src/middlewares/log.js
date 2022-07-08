module.exports = (app) => {
    app.use((req, res, next) => {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        fs = require('fs');
        
        let date = new Date().toLocaleString('fr-FR', { hour12: false, hour: "numeric", minute: "numeric", day: "2-digit", month: "2-digit", year: "numeric" });
        
        fs.appendFile('logs.txt', `${ip} ${req.method} ${req.url} ${date}\n`, (err) => {
            if (err) throw err;
        }
        );
        next();
    });
}