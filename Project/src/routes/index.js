const express = require('express');
const router = express.Router();

const { isLoggedIn, isAdmin } = require ('../lib/access');

// Render the principal page
router.get('/menu', isLoggedIn, (req, res) => {
    const { ID_PERFIL } = req.user;
    console.log(ID_PERFIL); // Validates values of user profile

    if(ID_PERFIL === 1) {
        res.render('menuadmin');
    }
    else {
        res.render('menu');
    }
    
});

module.exports = router;