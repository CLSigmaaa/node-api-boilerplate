// Import libraries
const jwt = require('jsonwebtoken');
require('dotenv').config()

// Const Variables
const privateKey = process.env.PRIVATE_KEY;

// Prisma
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// Check Auth
const checkAuth = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).send({ error: "No token has been given." });
        }

        const decodedToken = await jwt.verify(token, privateKey);
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: decodedToken.id
            },
            select: {
                id: true,
                email: true,
                role: true
            }
        });

        req.userData = user;
        next();
    } catch (err) {
        return res.status(401).send({ error: "Unauthorized." });
    }
}

module.exports = checkAuth;