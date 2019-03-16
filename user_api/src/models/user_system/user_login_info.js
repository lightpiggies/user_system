'use strict';

const Sequelize = require('sequelize');
const Sequelizor = require('../../libs/db_connection/user_system_connection');
const User = require('./user');
const passwordCrypt = require('../../utils/crypt').passwordCrypt;
const generateUid = require('../../utils/crypt').generateUid;

const UserLoginInfo = Sequelizor.define(
  'user_login_info',
  {
    uid: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull:  false,
    },
    last_login: {
      type: Sequelize.DATE,
    },
  },
  {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    hooks: {
      beforeCreate: async (userLoginInfo) => {
        userLoginInfo.uid = generateUid(userLoginInfo.username);
        userLoginInfo.password = await passwordCrypt.hashPassword(userLoginInfo.password);
      },
    },
  },
);

UserLoginInfo.prototype.checkPassword = async function (password) {
  const hashedPassword = this.getDataValue('password');
  const pswCorrect = await passwordCrypt.checkPassword(password, hashedPassword);
  return pswCorrect;
};

UserLoginInfo.prototype.createUser = async function (userInfo){
  const uid = this.getDataValue('uid');
  userInfo.nickname = userInfo.nickname || this.getDataValue('username');
  const user = await User.create({
    uid,
    ...userInfo,
  });
  return user;
};

module.exports = UserLoginInfo;
