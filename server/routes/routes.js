var express = require('express');
var router = express.Router();

//Import API's
var registersList = require('./registers');
var consultation = require('./consultation');
var analysis = require('./analysis');
var selfObservation = require('./selfObservation');
var analysisImage = require('./analysisImage');
var consultationImage = require('./consultationImage');
var account = require('./account');
var user = require('./user');
//Use API's

router.use("/registers", registersList);
router.use('/consultation', consultation);
router.use('/analysis', analysis);
router.use('/selfObservation', selfObservation);
router.use('/analysisImage', analysisImage);
router.use('/consultationImage', consultationImage);
router.use('/account', account);
router.use('/user', user);
module.exports = router;