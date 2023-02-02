// Import libraries
const express = require('express');
const router = express.Router();
const checkAuthentication = require('../middlewares/check-authentication');
const checkAuthorization = require('../middlewares/chech-authorization');

// Prisma
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

// CRUD Operations
router.get('/', checkAuthentication, checkAuthorization(['ADMIN']), (req, res) => {
    prisma.user.findMany({
        select: {
            id: true,
            email: true,
            createdAt: true,
            role: true
        }
    })
    .then((users) => {
            res.send(users);
    })
    .catch((err) => {
        res.status(500).send({ error: err.message });
    })
});

router.get('/:userId', checkAuthentication, checkAuthorization(['USER']), (req, res) => {
    prisma.user.findUnique({
        where: {
            id: req.params.userId
        },
        select: {
            id: true,
            email: true,
            createdAt: true,
            role: true
        }
    })
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.status(500).send({ error: err.message });
    })
});

router.patch('/:userId', checkAuthorization(['USER']), (req, res) => {
    prisma.user.update({
        where: {
            id: req.params.userId
        },
        data: {
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        },
        select: {
            id: true,
            email: true,
            createdAt: true
        }
    })
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        res.status(500).send({ error: "Internal Server Error" });
    })
})

router.delete('/:userId', checkAuthentication, checkAuthorization(['USER']), (req, res) => {
    prisma.user.delete({
        where: {
            id: req.params.userId
        }
    })
    .then((user) => {
        res.send(user);
    })
    .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).send({ error: 'User not found.' });
        }
        res.status(500).send({ error: err.message });
    })
});

// Export
module.exports = router;