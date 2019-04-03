const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const static = require('koa-static');

const checkToken = require('./middleware/check-token')


const router = require('./router');

const app = new Koa();

// 白名单
const whiteList = ['/login', '/register']

app.use(cors())
app.use(logger())
app.use(bodyParser())

app.use(static(__dirname + '/static'));
app.use(checkToken(whiteList));
app.use(router.routes());
app.use(router.allowedMethods());



const server = require('http').Server(app.callback());
const io = require('socket.io')(server);
io.on('connection', function(socket){
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
		console.log(socket.id)
		console.log(data);
	});
});
global.io = io
app.listen(3000);
server.listen(3001);
