'use strict';

const router = require('koa-router')();
const SystemRouter = require('./system');

router.use('/system', SystemRouter.routes(), SystemRouter.allowedMethods());

module.exports = router;
