const express = require('express');
const router = express.Router();

const pool = require('../database'); // Conection to database

// Render the list of beneficiarios to add new beneficiaries
router.get('/addbenef', (req, res) => {
    res.render('links/addbenef');
});

// Receive the new data to add new beneficiaries
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

// Render the total of beneficiaries in database
router.get('/listbenef', async (req, res) => {
    const beneficiarios = await pool.query('SELECT * FROM beneficiarios');
    /* console.log(beneficiarios); */ // Validates values received
    res.render('links/listbenef', { beneficiarios });
});

// Render the form to register benefciaries phone calls
router.get('/addcalls/:ID_BENEFICIARIO', async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    /* console.log(ID_BENEFICIARIO); */ // Validates the id received
    //await pool.query('INSERT INTO registro_llamadas (ID_BENEFICIARIO) VALUES(?)', [ID_BENEFICIARIO]); // Register IDEBENEFICIARIO into registro_llamadas table
    const newLinkCalls = await pool.query('SELECT * FROM registro_llamadas WHERE ID_BENEFICIARIO = ? ORDER BY ID_LLAMADA DESC LIMIT 1', ID_BENEFICIARIO);
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0], newLinkCalls[0]); */ // Validates values from both querys
    res.render('links/addcalls', {newLinksBenef: newLinkBenef[0], newLinksCalls: newLinkCalls[0]});
});

// Receive the new data to add new phone calls and data of beneficiaries
router.post('/addcalls/:ID_BENEFICIARIO', async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const { 
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
        SEXO,
        RESULTADO_LLAMADA,
        CONFIRMACION,
    } = req.body;

    const updateBenef = {
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
        SEXO
    };

    const newCall = {
        ID_BENEFICIARIO,
        RESULTADO_LLAMADA,
        CONFIRMACION
    };
    /* console.log(ID_BENEFICIARIO, updateBenef, newCall); */ // Validates values received
    await pool.query('UPDATE beneficiarios set ? WHERE ID_BENEFICIARIO = ?', [updateBenef, ID_BENEFICIARIO]);
    await pool.query('INSERT INTO registro_llamadas set ?', [newCall]);
    // await pool.query('UPDATE registro_llamadas SET RESULTADO_LLAMADA = ?, CONFIRMACION = ? WHERE ID_BENEFICIARIO = ? ORDER BY ID_LLAMADA DESC LIMIT 1', [updateCall.RESULTADO_LLAMADA, updateCall.CONFIRMACION, ID_BENEFICIARIO]);
    /* console.log(ID_BENEFICIARIO, updateBenef, updateCall.RESULTADO_LLAMADA, updateCall.CONFIRMACION); */ // Validates values received for updating tables
    res.redirect('/links/listbenef');
});


module.exports = router;
