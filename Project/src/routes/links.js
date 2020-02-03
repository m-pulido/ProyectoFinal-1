const express = require('express');
const router = express.Router();

const pool = require('../database'); // Conection to database

const { isLoggedIn } = require('../lib/access');  

// Render the list of beneficiarios to add new beneficiaries
router.get('/addbenef', isLoggedIn, (req, res) => {
    res.render('links/addbenef');
});

// Receive the new data to add new beneficiaries
router.post('/addbenef', isLoggedIn, async (req, res) => {
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
    req.flash('success', 'Beneficiario agregado'); // add message to indicates that a process is done
    res.redirect('/links/listbenef');
});

// Render the total of beneficiaries in database
router.get('/listbenef', isLoggedIn, async (req, res) => {
    const beneficiarios = await pool.query('SELECT * FROM beneficiarios');
    /* console.log(beneficiarios); */ // Validates values received
    res.render('links/listbenef', { beneficiarios });
});

// Render the form to register benefciaries phone calls
router.get('/addcalls/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    /* console.log(ID_BENEFICIARIO); */ // Validates the id received
    const newLinkCalls = await pool.query('SELECT * FROM registro_llamadas WHERE ID_BENEFICIARIO = ? ORDER BY ID_LLAMADA DESC LIMIT 1', ID_BENEFICIARIO);
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0], newLinkCalls[0]); */ // Validates values from both querys
    res.render('links/addcalls', {newLinksBenef: newLinkBenef[0], newLinksCalls: newLinkCalls[0]});
});

// Receive the new data to add new phone calls and data of beneficiaries
router.post('/addcalls/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
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
        CONFIRMACION
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
    // await pool.query('UPDATE registro_llamadas SET RESULTADO_LLAMADA = ?, CONFIRMACION = ? WHERE ID_BENEFICIARIO = ? ORDER BY ID_LLAMADA DESC LIMIT 1', [updateCall.RESULTADO_LLAMADA, updateCall.CONFIRMACION, ID_BENEFICIARIO]); // delete
    /* console.log(ID_BENEFICIARIO, updateBenef, updateCall.RESULTADO_LLAMADA, updateCall.CONFIRMACION); */ // Validates values received for updating tables
    req.flash('success', 'Llamada registrada');
    res.redirect('/links/listbenef');
});

// Render the form to search beneficiaries
router.get('/searchbenef', isLoggedIn, (req, res) => {
    res.render('links/searchbenef');
});

// Receive the data to initialize a search of beneficiaries
router.post('/searchbenef', isLoggedIn, async (req, res) => {
    try {
        const {
            CURP,
            NOMBRE,
            APELLIDO_PATERNO,
            APELLIDO_MATERNO,
            TEL_CASA,
            TEL_CELULAR,
            CORREO
        } = req.body;
    
        /* const newSearchBenef = {
            CURP,
            NOMBRE,
            APELLIDO_PATERNO,
            APELLIDO_MATERNO,
            TEL_CASA,
            TEL_CELULAR,
            CORREO
        }; */
        
        /* console.log(newSearchBenef.CURP, newSearchBenef.NOMBRE); */ // Validates values received
        if (CURP != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE CURP = ?', [CURP]);
            res.render('links/searchbenef', {listBenef});
        }

        else if (TEL_CASA != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE TEL_CASA = ?', [TEL_CASA]);
            res.render('links/searchbenef', {listBenef});
        }

        else if (TEL_CELULAR != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE TEL_CELULAR = ?', [TEL_CELULAR]);
            res.render('links/searchbenef', {listBenef});
        }

        else if (CORREO != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE CORREO = ?', [CORREO]);
            res.render('links/searchbenef', {listBenef});
        }
        
        else if (NOMBRE != '' || APELLIDO_PATERNO != '' || APELLIDO_MATERNO != '') {
            const listBenef = await pool.query('SELECT * FROM beneficiarios WHERE NOMBRE = ? OR APELLIDO_PATERNO = ? OR APELLIDO_MATERNO', [NOMBRE, APELLIDO_PATERNO, APELLIDO_MATERNO]);
            res.render('links/searchbenef', {listBenef});
        }
    }
    
    catch(e) {
        console.log(e);
    }
});

// Render the form to search specific beneficiarie
router.get('/modifbenef/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0]); */ // Validates values from both querys
    res.render('links/modifbenef', {newLinksBenef: newLinkBenef[0]});
});

// Receives the new data to update specific beneficiarie
router.post('/modifbenef/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
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
        ASISTENCIA
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

    const newAssist = { 
        ID_BENEFICIARIO,
        ASISTENCIA
    };
    /* console.log(updateBenef[0]); */ // Validates values received
    await pool.query('UPDATE beneficiarios set ? WHERE ID_BENEFICIARIO = ?', [updateBenef, ID_BENEFICIARIO]);
    await pool.query('INSERT INTO registro_asistencias set ?', [newAssist]);
    req.flash('success', 'Beneficiario actualizado y asistencia registrada');
    res.redirect('/links/searchbenef');
});

// Render the form to add assistances of beneficiaries
router.get('/addassist/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const newLinkAssist = await pool.query('SELECT * FROM registro_asistencias WHERE ID_BENEFICIARIO = ? ORDER BY ID_ASISTENCIA DESC LIMIT 1', ID_BENEFICIARIO);
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0], newLinkAssist[0]); */ // Validates values from both querys
    res.render('links/addassist', {newLinksBenef: newLinkBenef[0], newLinksAssist: newLinkAssist[0]});
});

// Receives the new data to add assistance of beneficiaries
router.post('/addassist/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const { ASISTENCIA } = req.body;

    const newAsistance = {
        ID_BENEFICIARIO,
        ASISTENCIA
    };
    /* console.log(ID_BENEFICIARIO, newAsistance); */ // Validates values received
    await pool.query('INSERT INTO registro_asistencias set ?', [newAsistance]);
    req.flash('success', 'Asistencia registrada');
    res.redirect('/links/searchbenef');
});

// Render the form to add deliveries of kits
router.get('/adddelivery/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const newLinkDelivery = await pool.query('SELECT * FROM registro_entregas WHERE ID_BENEFICIARIO = ? ORDER BY ID_ENTREGA DESC LIMIT 1', ID_BENEFICIARIO);
    const newLinkBenef = await pool.query('SELECT * FROM beneficiarios WHERE ID_BENEFICIARIO = ?', [ID_BENEFICIARIO]);
    /* console.log(newLinkBenef[0], newLinkAssist[0]); */ // Validates values from both querys
    res.render('links/adddelivery', {newLinksBenef: newLinkBenef[0], newLinksDelivery: newLinkDelivery[0]});
});

// Receives the new data to add a delivery
router.post('/adddelivery/:ID_BENEFICIARIO', isLoggedIn, async (req, res) => {
    const { ID_BENEFICIARIO } = req.params;
    const { ESTATUS_ENTREGA } = req.body;

    const newDelivery = {
        ID_BENEFICIARIO,
        ESTATUS_ENTREGA
    };
    /* console.log(newDelivery); */ // Validates values received
    await pool.query('INSERT INTO registro_entregas set ?', [newDelivery]);
    req.flash('success', 'Entrega registrada');
    res.redirect('/links/searchbenef');
});


module.exports = router;
