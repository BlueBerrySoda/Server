const Router = require('koa-router');

const account = new Router();
const accountCtrl = require('./account.controller');

account.get('/', accountCtrl.list);
account.get('/:id', accountCtrl.get);
account.post('/', accountCtrl.create);
account.delete('/:id', accountCtrl.delete);
account.put('/:id', accountCtrl.replace);
account.patch('/:id', accountCtrl.update);

module.exports = account;