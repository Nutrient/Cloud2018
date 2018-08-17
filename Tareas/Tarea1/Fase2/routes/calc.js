/*
 * ***************************************************
 *             COMPUTO EN LA NUBE                  *
 *                   ITESO                         *
 *                                                 *
 *    Actividad 1: Diseño de un WebService         *
 *    Codigo Base: Alvaro Parres (parres@iteso.mx) *
 *                                                 *
 ***************************************************
 *                                                 *
 * Instrucciones: Complete el codigo basado en     *
 * las indicaciones descritas en el documento      *
 *                                                 *
 ***************************************************
*/

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send('Main Page');
});

router.get('/:num1/:num2/sum', function(req, res, next) {
    var a = parseInt(req.params.num1, 10);
    var b = parseInt(req.params.num2, 10);

    res.send(req.params.num1+' + '+req.params.num2+' = '+(a+b));
});
router.get('/:num1/:num2/sub', (req, res, next) => {
    var a = parseInt(req.params.num1, 10);
    var b = parseInt(req.params.num2, 10);

    res.send(req.params.num1+' - '+req.params.num2+' = '+(a-b));
});
router.get('/:num1/:num2/mul', (req, res, next) => {
    var a = parseInt(req.params.num1, 10);
    var b = parseInt(req.params.num2, 10);

    res.send(req.params.num1+' * '+req.params.num2+' = '+(a*b));
});
router.get('/:num1/:num2/div', (req, res, next) => {
    var a = parseInt(req.params.num1, 10);
    var b = parseInt(req.params.num2, 10);
    if(b == 0)
      res.send("ERROR")
    else
      res.send(req.params.num1+' / '+req.params.num2+' = '+(a/b));
});

/*
 * ***********************************************
 * * @TODO complete las funciones que hacen
 * * falta para completar el wen services y sea
 * * capaz de sumar, restar, multiplicar y
 * * dividir. En el caso de la división es
 * * necesario validar que sea correcta la
 * * división.
 * ***********************************************
 */

module.exports = router;
