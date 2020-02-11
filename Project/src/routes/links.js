const express = require('express');
const router = express.Router();

const pool = require('../database'); // Conection to database

const { isLoggedIn, isAdmin } = require('../lib/access');

// Render all the users registered
router.get('/allusers', isLoggedIn, isAdmin, async (req, res) => {
    const users = await pool.query('SELECT usuarios.ID_USUARIO, usuarios.NOMBRE, usuarios.APELLIDO_PATERNO, usuarios.CORREO, cat_perfiles.PERFIL FROM usuarios RIGHT JOIN cat_perfiles ON usuarios.ID_PERFIL = cat_perfiles.ID_PERFIL');
    const allUsers = await pool.query('SELECT COUNT(ID_USUARIO) AS TOTAL_USUARIOS FROM usuarios');
    res.render('links/allusers', {users, allUser: allUsers[0]});
});

// Process to delete an user selected
router.get('/deleteuser/:ID_USUARIO', isLoggedIn, isAdmin, async (req, res) => {
    const { ID_USUARIO } = req.params;
    /* console.log(ID_USUARIO); */ // Validates the value received
    await pool.query('SET FOREIGN_KEY_CHECKS=OFF');
    await pool.query('DELETE FROM usuarios WHERE ID_USUARIO = ?', [ID_USUARIO]);
    await pool.query('SET FOREIGN_KEY_CHECKS=ON');
    req.flash('success', 'Usuario eliminado'); // add message to indicates that a process is done
    res.redirect('/links/allusers');
});

// Render all the beneficiaries in list
router.get('/allbenef', isLoggedIn, async (req, res) => {
    const beneficiarios = await pool.query('SELECT * FROM beneficiarios');
    const allBenefs = await pool.query('SELECT COUNT(ID_BENEFICIARIO) AS TOTAL_BENEFICIARIOS FROM beneficiarios');
    res.render('links/allbenef', { beneficiarios, allBenef: allBenefs[0] });
});

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
    /* const beneficiarios = await pool.query('SELECT * FROM beneficiarios'); */
    /* const registro_llamadas = await pool.query('SELECT * FROM registro_llamadas ORDER BY ID_LLAMADA'); */
    const beneficiarios = await pool.query('SELECT beneficiarios.ID_BENEFICIARIO, beneficiarios.CURP, beneficiarios.NOMBRE, beneficiarios.APELLIDO_PATERNO, beneficiarios.APELLIDO_MATERNO, beneficiarios.TEL_CASA, beneficiarios.TEL_CELULAR, beneficiarios.CORREO, registro_llamadas.ID_LLAMADA, registro_llamadas.RESULTADO_LLAMADA, registro_llamadas.CONFIRMACION, registro_llamadas.FECHA_LLAMADA FROM beneficiarios LEFT JOIN registro_llamadas ON beneficiarios.ID_BENEFICIARIO = registro_llamadas.ID_BENEFICIARIO WHERE registro_llamadas.ID_LLAMADA = (SELECT MAX(ID_LLAMADA) FROM registro_llamadas WHERE registro_llamadas.ID_BENEFICIARIO = beneficiarios.ID_BENEFICIARIO)');
    const confirms = await pool.query('SELECT COUNT(CONFIRMACION) AS CONFIRMACION FROM registro_llamadas WHERE CONFIRMACION = "CONFIRMA ASISTENCIA"');
    /* console.log(beneficiarios); */ // Validates values received
    /* console.log(confirms[0]); */ // Validates values from COUNT(CONFIRMADOS)
    res.render('links/listbenef', { beneficiarios, confirm: confirms[0] });
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
    const { ID_USUARIO } = req.user;
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
        CONFIRMACION,
        ID_USUARIO
    };

    /* console.log(ID_USUARIO); */ // Validates id of user
    /* console.log(ID_BENEFICIARIO, updateBenef, newCall); */ // Validates values received
    await pool.query('UPDATE beneficiarios set ? WHERE ID_BENEFICIARIO = ?', [updateBenef, ID_BENEFICIARIO]);
    await pool.query('INSERT INTO registro_llamadas set ?', [newCall]);
    // await pool.query('UPDATE registro_llamadas SET RESULTADO_LLAMADA = ?, CONFIRMACION = ? WHERE ID_BENEFICIARIO = ? ORDER BY ID_LLAMADA DESC LIMIT 1', [updateCall.RESULTADO_LLAMADA, updateCall.CONFIRMACION, ID_BENEFICIARIO]); // delete
    /* console.log(ID_BENEFICIARIO, updateBenef, updateCall.RESULTADO_LLAMADA, updateCall.CONFIRMACION); */ // Validates values received for updating tables
    req.flash('success', 'Llamada registrada');
    res.redirect('/links/allbenef');
});

// Render the form to search beneficiaries
router.get('/searchbenef', isLoggedIn, async (req, res) => {
    const allAssists = await pool.query('SELECT COUNT(ASISTENCIA) AS ASISTENCIA FROM registro_asistencias WHERE ASISTENCIA = "PRESENTE"');
    const allDeliverys = await pool.query('SELECT COUNT(ESTATUS_ENTREGA) AS ESTATUS_ENTREGA FROM registro_entregas WHERE ESTATUS_ENTREGA = "ENTREGADO"');
    res.render('links/searchbenef', { allAssist: allAssists[0], allDelivery: allDeliverys[0]});
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
        ASISTENCIA,
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
    const { ID_USUARIO } = req.user;
    const { ASISTENCIA } = req.body;

    const newAsistance = {
        ID_BENEFICIARIO,
        ASISTENCIA,
        ID_USUARIO
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
    const { ID_USUARIO } = req.user;
    const { ESTATUS_ENTREGA } = req.body;

    const newDelivery = {
        ID_BENEFICIARIO,
        ESTATUS_ENTREGA,
        ID_USUARIO
    };
    /* console.log(newDelivery); */ // Validates values received
    await pool.query('INSERT INTO registro_entregas set ?', [newDelivery]);
    req.flash('success', 'Entrega registrada');
    res.redirect('/links/searchbenef');
});


module.exports = router;
