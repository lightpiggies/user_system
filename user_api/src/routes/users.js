'use strict';

const router = require('koa-router')();
const _ = require('lodash');
const User = require('../models/user_system/user');
const UserLoginInfo = require('../models/user_system/user_login_info');
const UserError = require('../libs/error');
const CRUD = require('../libs/crud');

router.get('/', async (ctx, next) => {
  const accurateSearch = _.toInteger(ctx.query.accurate_search || '0'); // 默认模糊搜索
  const filter = JSON.parse(ctx.query.filter || '{}');
  const order = ctx.query.order;
  const page = ctx.query.page;
  const pagesize = ctx.query.pagesize;
  const userInfoSearchFields = ['nickname', 'phone_number', 'email'];
  let model = User;
  let accurate = accurateSearch;
  let searchFields = userInfoSearchFields;
  // 在对username进行搜索的情况下，只支持精确搜索，不对其他fields进行筛选
  if (filter.username) {
    model = UserLoginInfo;
    searchFields = ['username'];
    accurate = 1;
  }

  ctx.state.data = await CRUD.readAllByFilter(model, filter, searchFields, order, page, pagesize, accurate);
  await next();
});

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
