const baseUrl = 'http://sso.jskou.com'
// const baseUrl = 'http://localhost:3000'
const public = {
	message: {
		show(type, str){
			let dom = $('.message[type=' + type + ']')
			if(!dom.length){
				dom = $('<div class="message animated fadeInDown" type="' + type + '"></div>')
				$('body').append(dom)
			}
			this.clear(dom)
			dom.html(str)
			dom.show()
			this.time1 = setTimeout(() => {
				dom.addClass('fadeOutUp')
				this.time2 = setTimeout(() => {
					dom.hide()
					dom.removeClass('fadeOutUp')
				}, 500)

			}, 2000)
		},
		time1: '',
		time2: '',
		clear(dom){
			if(this.time1) clearTimeout(this.time1)
			if(this.time2) clearTimeout(this.time2)
			dom.hide()
			dom.removeClass('fadeOutUp')
		},
		danger(str){
			this.show('danger', str)
		},
		success(str){
			this.show('success', str)
		}
	},
	shake(ele){
		let dom = $(ele)
		dom.addClass('animated shake')
		setTimeout(() => {
			dom.removeClass('shake')
		}, 500)
	},
	api: {
		login: (data) => {
			return $.post({
				url: `${baseUrl}/login`,
				data
			})
		},
		register: (data) => {
			return $.post({
				url: `${baseUrl}/register`,
				data
			})
		},
		verification: (data) => {
			return $.post({
				url: `${baseUrl}/login/verification`,
				data
			})
		}
	}
}