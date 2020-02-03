const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

// Signin
passport.use('local.signin', new LocalStrategy({
    usernameField: 'CORREO',
    passwordField: 'PASSWORD',
    passReqToCallback: true 
}, async (req, CORREO, PASSWORD, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE CORREO = ?', [CORREO]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(PASSWORD, user.PASSWORD);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.CORREO));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecto'));
        }
    } else {
        return done(null, false, req.flash('message', 'Usuario no existe'));
    }
}));

// Signup
passport.use('local.signup', new LocalStrategy({
    usernameField: 'CORREO',
    passwordField: 'PASSWORD',
    passReqToCallback: true
}, async (req, CORREO, PASSWORD, done) => {
    const { 
        NOMBRE,
        APELLIDO_PATERNO,
        APELLIDO_MATERNO
     } = req.body;

    const newUser = {
        NOMBRE,
        APELLIDO_PATERNO,
        APELLIDO_MATERNO,
        CORREO,
        PASSWORD,
    };
    newUser.PASSWORD = await helpers.encryptPassword(PASSWORD);
    const result = await pool.query('INSERT INTO usuarios set ?', [newUser]);
    newUser.ID_USUARIO = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.ID_USUARIO);
});

passport.deserializeUser( async (ID_USUARIO, done) => {
    const rows = await pool.query('SELECT * FROM usuarios WHERE ID_USUARIO = ?', [ID_USUARIO]);
    done(null, rows[0]);
});