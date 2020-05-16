const Router = require('koa-router');

const api = new Router();
const account = require('./account');
const auth = require('./auth');

api.use('/auth', auth.routes());

api.use('/account', account.routes());

module.exports = api;