// Import libraries
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()

// Const variables
const privateKey = process.env.PRIVATE_KEY;

// Prisma
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// Login Route
router.post('/login', async(req, res) => {
    if (!req.body.password || !req.body.email) {
        return res.status(400).send({ error: 'Email and password are required.' });
    }
    try {
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email: req.body.email
            }
        });

        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ error: 'Invalid password.' });
        }

        const token = jwt.sign({ id: user.id }, privateKey, { expiresIn: '1h' });
        return res.send({ message: "Login successful!", token: token });

    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.status(500).send({ error: err.message });
    }

});

// Register Route
router.post('/register', async(req, res) => {
    if (!req.body.password || !req.body.email) {
        return res.status(400).send({ error: 'Email and password are required.' });
    }
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hash
            },
            select: {
                id: true,
                email: true,
                createdAt: true,
                role: true
            }
        });
        return res.json({ message: "User created successfully!", user: user })
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
            return res.status(409).send({ error: 'User already exists.' });
        }
        res.status(500).send({ error: err.message });
    }
});

// Export
module.exports = router;