const express = require('express');
const router = express.Router();

const pool = require('../database'); // Conection to database

router.get('/addbenef', (req, res) => {
    res.render('links/addbenef');
});

router.post('/addbenef', async (req, res) => {
    const { ID_BENEFICIARIO,
            CURP,
            NOMBRE,
            APELLIDO_PATERNO,
            APELLIDO_MATERNO,
            TEL_CASA,
            TEL_CELULAR,
            CORREO,
            PROGRAMA,
            CALLE,
            NUM_EXT,
            NUM_INT,
            COLONIA,
            CODIGO_POSTAL,
            MUNICIPIO,
            ESTADO,
            SEXO
        } = req.body;

        const newBeneficiario = {
            ID_BENEFICIARIO,
            CURP,
            NOMBRE,
            APELLIDO_PATERNO,
            APELLIDO_MATERNO,
            TEL_CASA,
            TEL_CELULAR,
            CORREO,
            PROGRAMA,
            CALLE,
            NUM_EXT,
            NUM_INT,
            COLONIA,
            CODIGO_POSTAL,
            MUNICIPIO,
            ESTADO,
            SEXO
        };
    /* console.log(newBeneficiario); */ // Validates values received
    await pool.query('INSERT INTO beneficiarios set ?', [newBeneficiario]);
    res.redirect('/links/listbenef');
});

router.get('/listbenef', async(req, res) => {
    const beneficiarios = await pool.query('SELECT * FROM beneficiarios');
    /* console.log(beneficiarios); */ // Validates values received
    res.render('links/listbenef', { beneficiarios });
});

module.exports = router;
