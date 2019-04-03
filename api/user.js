const {encryption, uuid, moment} = require('../utils');


const {User, Ver} = require('../db');

const login = async (ctx) => {

	let {mobile, password} = ctx.request.body
	password = encryption(password)

	try {
		let user = await User.findOne({
			mobile,
			password
		}, 'username')

		if(!user){
			ctx.body = {
				code: 1,
				msg: '手机号或密码错误'
			}
			return 0
		}



		if(user.token && moment().isBefore(user.expiry_time)){
			user.expiry_time = moment().add(1, 'M');
		} else {
			user.token = uuid()
			user.expiry_time = moment().add(1, 'M');
		}

		user.save()

		ctx.body = {
			code: 0,
			user
		}
	} catch (err) {
		ctx.body = err
	}
}

const logout = async (ctx) => {

	let {token} = ctx.request.body

	console.log('logout')
	try {
		let user = await User.findOne({
			token
		})

		user.token = ''
		user.expiry_time = '';
		user.save()
		ctx.body = {
			code: 0
		}
	} catch (err) {
		ctx.body = err
	}
}

const getUserByToken = async (ctx) => {

	let {token} = ctx.request.body

	try {
		let user = await User.findOne({
			token
		})

		ctx.body = {
			code: 0,
			user
		}
	} catch (err) {
		ctx.body = err
	}
}

// 注册用户
const register = async (ctx) => {
	let {mobile, password, username, uid, auth} = ctx.request.body
	password = encryption(password)

	if(!(/^1\d{10}$/.test(mobile))){
		ctx.body = {
			code: 1,
			msg: '手机号不正确'
		};
		return 0
	}

	if(!password){
		ctx.body = {
			code: 1,
			msg: '密码不能为空'
		};
		return 0
	}

	if(!username){
		ctx.body = {
			code: 1,
			msg: '用户名不能为空'
		};
		return 0
	}

	if(!uid || !auth){
		ctx.body = {
			code: 1,
			msg: '请人机验证'
		};
		return 0
	}


	try {

		let ver = await Ver.findOne({
			uid,
			auth
		})

		if(!ver){
			ctx.body = {
				code: 1,
				msg: '非法验证'
			};
			return 0
		}

		console.log(ver)
		if(ver.invalid){
			ctx.body = {
				code: 1,
				msg: '验证失效'
			};
			return 0
		}

		ver.invalid = true
		ver.save()
		let user = await User.findOne({
			mobile
		})

		if(user){
			ctx.body = {
				code: 1,
				msg: '用户已存在'
			};
			return 0
		}

		const res = await User.create({
			username,
			mobile,
			password
		})

		ctx.body = {
			code: 0,
			res
		};
	} catch (err) {
		console.log(err)
		ctx.body = {
			code: 1,
			err
		};
	}

}

const getLoginId = async (ctx) => {

	let {token, socketid} = ctx.request.body

	let user = await User.findOne({
		token
	})

	global.io.to(socketid).emit('news', user);
	ctx.body = {
		code: 0
	}
}


module.exports = {
	getUserByToken,
	register,
	login,
	logout,
	getLoginId
}
