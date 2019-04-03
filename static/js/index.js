const {message, shake, api} = public

let socket = ''
const qrcodeLogin = () => {
	if (socket) {
		socket.close()
	}
	socket = io('http://sso.jskou.com:3001');

	socket.on('news', (data) => {
		console.log(data);
		console.log(socket.id)

		if (data.token) {
			message.success(data.username + '登陆成功')
		} else {
			$('#qrcode').html('')

			new QRCode('qrcode', {
				text: socket.id,
				width: 165,
				height: 165,
				colorDark: '#000000',
				colorLight: '#ffffff',
				correctLevel: QRCode.CorrectLevel.H
			});
		}
	});
}

const passwordLogin = () => {

	const mobile = $('.mobile').val()
	const password = $('.password').val()
	api.login({
		mobile,
		password
	}).then(res => {
		if (!res.code) {
			message.success(res.user.username + '登陆成功')
		} else {
			message.danger(res.msg)
			shake('.login')
		}
	})

}

$('.login-btn').click(passwordLogin)

$('.login-type').on('mouseenter', function (e) {
	$('.login-type img').addClass('bounceIn')
});

$('.login-type').on('mouseleave', function (e) {
	$('.login-type img').removeClass('bounceIn')
});

$('.login-type img').click(function () {
	const type = $(this).data('type')
	if (type == 'qr') {
		$('.login-body-qr').show()
		$('.login-body-pw').hide()
		$('.login-title').html('扫码登录')
		qrcodeLogin()
	} else {
		$('.login-body-qr').hide()
		$('.login-body-pw').show()
		$('.login-title').html('密码登录')
	}
	$(this).hide()
	$(this).siblings().show()
})



function show(index){
	$('p').eq(index).fadeIn(2000)

	let length = $('p').length

	setTimeout(() => {
		$('p').eq(index).fadeOut(2000)

	}, 4000)

	setTimeout(()=> {
		if(index < length - 1){
			index++
		} else {
			index = 0
		}
		show(index)
	}, 6000)

}
show(0)