const {uuid, encryption} = require('../utils');
const {Ver} = require('../db');

const getAuth = async (ctx) => {

	let {uid, start_time, end_time, code} = ctx.request.body

	if(end_time - start_time > 3000
		|| !uid
		|| !code
		|| encryption((end_time - start_time + uid)) != code) {
		ctx.body = {
			code: 1,
			msg: '非法验证'
		}
		return 0
	}

	let auth = uuid()
	let ver = await Ver.update({
		uid
	}, {
		start_time,
		end_time,
		uid,
		code,
		auth
	}, {
		upsert: true
	});

	ctx.body = {
		code: 0,
		auth
	}
}


module.exports = {
	getAuth
}
