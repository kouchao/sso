const {api} = public
//一、定义一个获取DOM元素的方法
localStorage.uid = ''
localStorage.auth = ''

var box = $(".v-drag")[0],//容器
	bg = $(".v-bg")[0],//背景
	text = $(".v-text")[0],//文字
	btn = $(".v-btn")[0],//滑块
	success = false,//是否通过验证的标志
	distance = box.offsetWidth - btn.offsetWidth;//滑动成功的宽度（距离）


let startTime = ''
let endTime = ''

// 0 通过 1等待解锁 2超时
function setState(n) {
	let color = [{
		color: '#0f0',
		text: '验证通过'
	}, {
		color: '#75CDF9',
		text: '请拖动滑块解锁'
	}, {
		color: '#f00',
		text: '超时'
	}]

	text.innerHTML = color[n].text;
	bg.style.backgroundColor = color[n].color;
	text.style.color = "#fff";

	if (n) {
		btn.innerHTML = "&radic;";
		localStorage.code = ''
	}
	if (n == 1) text.style.color = "#000";

}

//二、给滑块注册鼠标按下事件
btn.onmousedown = function (e) {
	startTime = new Date().getTime()
	//1.鼠标按下之前必须清除掉后面设置的过渡属性
	btn.style.transition = "";
	bg.style.transition = "";

	//说明：clientX 事件属性会返回当事件被触发时，鼠标指针向对于浏览器页面(或客户区)的水平坐标。

	//2.当滑块位于初始位置时，得到鼠标按下时的水平位置
	var e = e || window.event;
	var downX = e.clientX;

	//三、给文档注册鼠标移动事件
	document.onmousemove = function (e) {

		var e = e || window.event;
		//1.获取鼠标移动后的水平位置
		var moveX = e.clientX;

		//2.得到鼠标水平位置的偏移量（鼠标移动时的位置 - 鼠标按下时的位置）
		var offsetX = moveX - downX;

		//3.在这里判断一下：鼠标水平移动的距离 与 滑动成功的距离 之间的关系
		if (offsetX > distance) {
			offsetX = distance;//如果滑过了终点，就将它停留在终点位置
		} else if (offsetX < 0) {
			offsetX = 0;//如果滑到了起点的左侧，就将它重置为起点位置
		}

		//4.根据鼠标移动的距离来动态设置滑块的偏移量和背景颜色的宽度
		btn.style.left = offsetX + "px";
		bg.style.width = offsetX + "px";

		//如果鼠标的水平移动距离 = 滑动成功的宽度
		if (offsetX == distance) {
			endTime = new Date().getTime()

			if (endTime - startTime > 3000) {
				setState(2)
				return false
			}

			//1.设置滑动成功后的样式
			setState(0)


			//2.设置滑动成功后的状态
			success = true;

			//成功后，清除掉鼠标按下事件和移动事件（因为移动时并不会涉及到鼠标松开事件）
			btn.onmousedown = null;
			document.onmousemove = null;


			//3.成功解锁后的回调函数
			isOpen()

			// setTimeout(function () {
			// 	alert('解锁成功！');
			// }, 100);
		}
	}

	//四、给文档注册鼠标松开事件
	document.onmouseup = function (e) {

		//如果鼠标松开时，滑到了终点，则验证通过
		if (success) {
			return;
		} else {
			//反之，则将滑块复位（设置了1s的属性过渡效果）
			btn.style.left = 0;
			bg.style.width = 0;
			btn.style.transition = "left 1s ease";
			bg.style.transition = "width 1s ease";

			setState(1)
		}
		//只要鼠标松开了，说明此时不需要拖动滑块了，那么就清除鼠标移动和松开事件。
		document.onmousemove = null;
		document.onmouseup = null;
	}


}

function isOpen() {
	let uid = getUUID()
	api.verification({
		start_time: startTime,
		end_time: endTime,
		uid: getUUID(),
		code: hex_md5(endTime - startTime + getUUID())
	}).then(res => {
		if(res.code == 0){
			localStorage.uid = uid
			localStorage.auth = res.auth
		}

	})

}

function bin2hex(s) {
	var i, l, o = '',
		n;

	s += '';

	for (i = 0, l = s.length; i < l; i++) {
		n = s.charCodeAt(i).toString(16);
		o += n.length < 2 ? '0' + n : n;
	}

	return o;
}

function getUUID(domain) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext("2d");
	var txt = domain;
	ctx.textBaseline = "top";
	ctx.font = "14px 'Arial'";
	ctx.textBaseline = "tencent";
	ctx.fillStyle = "#f60";
	ctx.fillRect(125, 1, 62, 20);
	ctx.fillStyle = "#069";
	ctx.fillText(txt, 2, 15);
	ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
	ctx.fillText(txt, 4, 17);

	var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
	var bin = atob(b64);
	var crc = bin2hex(bin.slice(-16, -12));
	return crc;
}
