'use strict';

const _ = require('lodash');
const Sequelize = require('sequelize');

/**
 * @param {object} filter
 * @param {string array} fields
 * @param {number} accurate 仅字符串支持模糊搜索, 默认为非字符串精确、字符串模糊搜索
 */
const cleanFilter = (filter, fields, accurate = 0) => {
  const options = _.pickBy(filter, (v, k) => (fields.includes(k) || ['$or'].includes(k)));
  _.forEach(_.toPairs(options), ([k, v]) => {
    if (v && _.isString(v) && accurate === 0) {
      options[k] = {
        [Sequelize.Op.like]: `%${v}%`,
      };
    }
    if (k === '$or' && _.isArray(v) && v.length > 0) {
      options.$or = v.map(item => cleanFilter(item, fields));
    }
  });
  return options;
};

const cleanOrder = (order, pmodel) => {
  const orders = [];
  const attrs = _.keys(pmodel.attributes || {});
  if (_.isString(order)) {
    for (const item of order.split(',').filter(e => e)) {
      const [f, o] = item.split(' ');
      if (f && o && attrs.includes(f)) orders.push([f, o]);
    }
  }
  return orders;
};

class CRUD {
  static async readAllByFilter(model, filter, filterFields, order, page, pagesize, accurate) {
    const { count: total, rows: items } = await model.findAndCountAll({
      where: cleanFilter(filter, filterFields, accurate),
      distinct: true,
      order: cleanOrder(order),
      limit: pagesize,
      offset: (page - 1) * pagesize,
    });

    return {
      total,
      page,
      pagesize,
      items,
    };
  }
}

module.exports = CRUD;
