'use strict';

const _ = require('lodash');
const moment = require('moment');
const Sequelize = require('sequelize');
const Sequelizor = require('../../libs/db_connection/user_system_connection');

const GENDERS = {
  FEMALE: 1,
  MALE: 2,
  OTHER: 0,
};

const User = Sequelizor.define(
  'user',
  {
    uid: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    nickname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    phone_number: {
      type: Sequelize.STRING,
    },
    area_code: {
      type: Sequelize.STRING,
      set: function (val) {
        if(!_.isUndefined(this.getDataValue('phone_number'))) {
          this.setDataValue('area_code', val || '+86');
        }
      },
    },
    email: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.INTEGER,
      validate: {
        isIn: {
          args: [_.values(GENDERS)],
          msg: 'gender的值非法',
        },
      },
    },
    birthday: {
      type: Sequelize.DATE,
      set: function(val) {
        this.setDataValue('birthday', new Date(moment(val)));
      },
      get: function() {
        return moment(this.getDataValue('birthday')).format('YYYY-MM-DD');
      },
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

User.GENDERS = GENDERS;

User.prototype.internalOutput = function (){
  const data = this.toJSON();
  return  {
    ..._.pick(data, ['nickname', 'avatar', 'area_code', 'phone_number', 'email', 'gender', 'birthday']),
  };
};

module.exports = User;
