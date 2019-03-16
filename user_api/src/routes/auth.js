'use strict';

const router = require('koa-router')();
const _ = require('lodash');
const moment = require('moment');
const User = require('../models/user_system/user');
const UserLoginInfo = require('../models/user_system/user_login_info');
const UserError = require('../libs/error');

router.post('/login', async (ctx, next) => {
  const user = await UserLoginInfo.findOne({
    where: {
      username: ctx.request.body.username,
    },
  });
  if (!user) throw new UserError(UserError.CODES.USER_NOT_EXIST, '用户不存在');
  const pswCorrect = await user.checkPassword(ctx.request.body.password);
  if (!pswCorrect) {
    throw new UserError(UserError.CODES.USER_PASSWORD_ERR, '密码错误');
  }

  user.last_login = moment();
  await user.save();

  // 登陆成功后更新last_login
  ctx.state.data = {
    user_id: user.uid,
    device_id: ctx.query.device_id,
  };
  await next();
});

module.exports = router;
