module.exports = {

    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/signin');
    }, 

    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/menu');
    }, 

    isAdmin(req, res, next) {
        const { ID_PERFIL } = req.user;
        if (ID_PERFIL === 1) {
            return next();
        }
        return res.redirect('/menu');
    }

};