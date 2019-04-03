const Router = require('koa-router')();
const { user, ver } = require('../api');

Router.get('/getUserByToken', user.getUserByToken)
Router.post('/register', user.register)
Router.post('/login', user.login)
Router.post('/logout', user.logout)
Router.post('/getLoginId', user.getLoginId)
Router.post('/login/verification', ver.getAuth)



module.exports = Router