'use strict';

const Sequelize = require('sequelize');
const Sequelizor = require('../../libs/db_connection/user_system_connection');

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
  },
);

module.exports = UserLoginInfo;
