$(function(){
	//根据时间戳获取时间
	function format(timestamp){
		var time = new Date(timestamp);
		var y = time.getFullYear();
		var m = time.getMonth()+1;
		var d = time.getDate();
		var h = time.getHours();
		var mm = time.getMinutes();
		var s = time.getSeconds();
		return y + '年' + (m + 1) + '月' + d + '日';
	}

	$('.map__icon').mouseover(function(){
		var msg = $(this).data('message');
		var lastTime = new Date(msg.lastTime) || null, checker = msg.lastCheck || null;
		if(lastTime){
			lastTime = format(lastTime);
			var str = checker + '在' + lastTime +'检查' ;
		} else{
			var str = '该设备还未被检测';
		}

		layer.tips(str, $(this), {
			tips: [1, '#666'] //还可配置颜色
		});
	})

	$('.map__icon').click(function(){
		var msg = $(this).data('message');
		var lastTime = new Date(msg.lastTime) || '', checker = msg.check || '', duty = msg.duty || '', name = msg.name, validTime = new Date(msg.validTime), type = msg.type;
		lastTime = format(lastTime);
		validTime = format(validTime);
		var imgUrl;
		switch(type){
		case 'hydrant':
			imgUrl = './img/hydrant.jpg'
			break;
		}
		var layerHtml;
		layerHtml = '<img src = ' + imgUrl + ' class="Pa">' +
					'<ul class="details">' +
						'<li><h3>' + name + '</h3></li>' +
						'<li>有效期：<i>' + validTime + '</i></li>' +
						'<li>负责人：<i>' + duty + '</i></li>' +
						'<li>检查人：<i>' + checker + '</i></li>' +
						'<li>最后检查时间：<i>' + lastTime + '</i></li>' +
					'</ul>';
		layer.open({
			type: 1,
			skin: 'layui-layer-demo', //样式类名
			scrollbar: false,
			maxWidth: 600,
			title: false,
			anim: 2,
			shadeClose: true, //开启遮罩关闭
			content: layerHtml
		});
	})
	
	/**	
	 * getTotal获取设备总数
	 **/
	function getTotal(){
		var total = $('.map__icon:visible').length;
		var undetected = $('.map__icon.undetected:visible').length;
		var invalid = $('.map__icon.invalid:visible').length;
		var str = '共有' + total + '个设备：有效' + (total - undetected - invalid) + '个，未检' + undetected + '个，失效' + invalid + '个';
		$('.map__top__filter__total').html(str);
	}
	getTotal();

	$('.map__top__filter__btn').click(function(){
		var type = $(this).data('type');
		$(this).toggleClass('act');
		$('.map__icon__' + type).toggleClass('hide');
		getTotal();
	})
})