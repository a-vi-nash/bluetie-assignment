'use strict';
const express = require('express'),
    router = express.Router();

router.use('/inspection', require('./inspection'));
router.use('/user', require('./user'));

module.exports = router;
