const express = require('express');
const router = express.Router();

const pool = require('../database'); // Conection to database

router.get('/adduser', (req, res) => {
    res.render('links/adduser');
});

router.post('/adduser', (req, res) => {
    res.send('Received');
});

module.exports = router;