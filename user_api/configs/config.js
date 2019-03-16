'use strict';

const _ = require('lodash');

const common = {
  dbs: {
    userSystem: {
      database: 'user_system',
      username: 'root',
      password: 'piggy123',
      conn: {
        host: '127.0.0.1',
        dialect: 'mysql',
        timezone: '+08:00',
        pool: {
          max: 20,
          min: 0,
          idle: 10000,
        },
        dialectOptions: {
          charset: 'utf8mb4',
        },
      },
    },
  },
};

const stgConf = {};
const prodConf = {};

const env = {
  PROD: ['prod', 'production'],
};

let config = _.merge({}, common);
if (env.PROD.includes(process.env.NODE_ENV)) config = _.merge(config, prodConf);
else config = _.merge(config, stgConf);

module.exports = config;
