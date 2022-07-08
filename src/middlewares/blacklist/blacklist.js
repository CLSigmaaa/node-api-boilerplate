const blacklistedIps = require('./blacklisted_ips.json')

module.exports = (app) => {
    app.use((req, res, next) => {
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        if (blacklistedIps.ip.includes(ip)) {
            res.status(403).send('Forbidden');
        }
        next();
    })
}