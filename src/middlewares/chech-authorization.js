// Import libraries
require('dotenv').config()

// Const Variables
const adminRoles = process.env.ADMIN_ROLES.split(',');

const checkAuthorization = (allowedRoles) => {
    return async(req, res, next) => {
        console.log(req.userData);
        // Horizontal and Vertical Authorization
        if (!adminRoles.includes(req.userData.role)) {
            if (req.params.userId) {
                if (req.params.userId !== req.userData.id) {
                    return res.status(403).send({ error: "Forbidden, content isn't yours." });
                }
            }
            if (!allowedRoles.includes(req.userData.role)) {
                return res.status(403).send({ error: "Forbidden, not enough privileges." });
            }
        }
        next();
    }
}

module.exports = checkAuthorization;