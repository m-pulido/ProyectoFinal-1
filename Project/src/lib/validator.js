const { body, validationResult } = require('express-validator')
const benefValidationRules = () => {
  return [
        body('CURP').matches(/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/)
        .withMessage('La CURP debe tener 18 caracteres.'),
        body('NOMBRE').isAlpha("es-ES").withMessage('Revise que el nombre no contenga numeros.'),
        body('APELLIDO_PATERNO').isAlpha("es-ES").withMessage('Revise que el apellido no contenga numeros.'),
        body('APELLIDO_MATERNO').isAlpha("es-ES"),
        body('TEL_CASA')
            .isNumeric()
            .isLength({min: 8})
            .withMessage('Solo pueden usarse numeros.'),
        body('TEL_CELULAR').isMobilePhone("es-MX").withMessage('Revise que el numero este correcto.'),
        body('CORREO').isEmail(),
        body('PROGRAMA').isAlpha("es-ES"),
        body('CALLE').isAlpha("es-ES"),
        body('NUM_EXT').isNumeric(),
        body('NUM_INT').isNumeric(),
        body('CODIGO_POSTAL').isPostalCode("MX")

    ]
}

const validate = (req, res, next) => {

    const errors = validationResult(req).array();
    if (errors) {
        req.session.errors = errors;
        req.session.success = false;
        return res.redirect('./addbenef');
    } else {
        return next()
    }
  }
  
  module.exports = {
    benefValidationRules,
    validate,
  }