'use strict';

const Sequelize = require('sequelize');
const config = require('../../../configs/config');

const conn = new Sequelize(
    config.dbs.userSystem.database,
    config.dbs.userSystem.username,
    config.dbs.userSystem.password,
    config.dbs.userSystem.conn,
);

module.exports = conn;
