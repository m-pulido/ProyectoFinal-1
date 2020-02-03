const express = require('express');
const router = express.Router();

const { isLoggedIn } = require ('../lib/access');

// Render the principal page
router.get('/menu', isLoggedIn, (req, res) => {
    res.render('menu');
});

module.exports = router;