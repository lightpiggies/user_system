'use strict';

const crypto = require('crypto');
const moment = require('moment');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const hashPassword = async (psw) => {
  return bcrypt.hash(psw, saltRounds);
};

const checkPassword = async (psw, hash) =>  {
  return bcrypt.compare(psw, hash);
};

const generateUid = function (username) {
  return crypto.createHash('md5').update(username).update(_.toString(moment())).digest('hex');
}

module.exports = {
  passwordCrypt: {
    hashPassword,
    checkPassword,
  },
  generateUid,
};
