const {moment} = require('../utils');
const {User} = require('../db');

let whiteList = []

const checkToken = async (ctx, next) => {

	let res = whiteList.filter(o => new RegExp('^' + o).test(ctx.request.url)).length

	let {token} = ctx.request.body


	// 需要检查 但是没有传token字段
	if (!res && !token) {
		ctx.body = {
			code: 1,
			msg: '无token'
		}

		return 0
	}

	// 需要检查并且有token字段
	if (!res && token) {
		// token匹配不到用户
		let user = await User.findOne({
			token
		})

		if (!user) {
			ctx.body = {
				code: 1,
				msg: 'token匹配不到用户'
			}

			return 0
		}

		// token过期
		if (!moment().isBefore(user.expiry_time)) {
			ctx.body = {
				code: 1,
				msg: 'token过期'
			}
			return 0
		}

		await next();

		return 0

	}
	await next();

}

module.exports = function (list = []) {
	whiteList = list
	return checkToken
}