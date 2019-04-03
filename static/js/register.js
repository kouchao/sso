(function () {
	const {message, shake, api} = public
	const registerUser = () => {

		const username = $('.username').val()
		const password = $('.password').val()
		const passwordAgain = $('.password-again').val()
		const mobile = $('.mobile').val()

		const uid = localStorage.uid
		const auth = localStorage.auth

		if (!username) {
			message.danger('用户名不能为空')
			shake('.register')
			return 0
		}

		if (!password) {
			message.danger('用户名不能为空')
			shake('.register')
			return 0
		}

		if (password !== passwordAgain) {
			message.danger('两次输入密码不一致')
			shake('.register')
			return 0
		}

		if (!(/^1\d{10}$/.test(mobile))) {
			message.danger('手机号格式不正确')
			shake('.register')
			return 0
		}

		if (!uid || !auth) {
			message.danger('请滑动验证')
			shake('.register')
			return 0
		}

		api.register({
			username,
			password,
			mobile,
			uid,
			auth
		}).then(res => {
			if (!res.code) {
				message.success('注册成功')
			} else {
				message.danger(res.msg || res.err.message)
				shake('.register')
			}
		})

	}

	$('.register-btn').click(registerUser)
})()
