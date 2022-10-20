module.exports = (req, res, next) => {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if(ip === '::ffff:172.17.2.96' || ip === "::ffff:172.17.2.204"){
        const message = "T'es banni fdp";
        res.status(403).json({message});
    }
}