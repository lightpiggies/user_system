'use strict';

const router = require('koa-router')();
const _ = require('lodash');
const User = require('../models/user_system/user');
const UserLoginInfo = require('../models/user_system/user_login_info');
const UserError = require('../libs/error');

router.get('/:id', async (ctx, next) => {
  const uid = ctx.params.id;
  const user = await User.findById(uid);
  if (!user) throw new UserError(UserError.CODES.USER_NOT_EXIST, '用户不存在');
  ctx.state.data = user.internalOutput();
  await next();
});

router.post('/', async (ctx, next) => {
  const registeredUser = await UserLoginInfo.create(_.pick(
    ctx.request.body, ['username', 'password'],
  ));
  const user = await registeredUser.createUser(_.pick(
    ctx.request.body,
    ['nickname', 'avatar', 'gender', 'birthday', 'area_code', 'phone_number', 'email'],
  ));
  ctx.state.data = user.internalOutput();
  await next();
});

router.put('/:id', async (ctx, next) => {
  const uid = ctx.params.id;
  const user = await User.update({
    ..._.pick(
      ctx.request.body,
      ['nickname', 'avatar', 'gender', 'birthday', 'area_code', 'phone_number', 'email'],
    ),
  }, {
    where: {
      uid: uid,
    },
  });
  ctx.state.data = await User.findById(uid).then(u => u.internalOutput());
  await next();
});

module.exports = router;
