$.ajax({
	type : "get",
	url : "http://huhuajian.pe.hu/public/index.php/index/index/get_left_list",
	async:false,
	dataType : "jsonp",
	jsonp: "callback",
	jsonpCallback:"h",
	success: function(data){
		if (data.message == 'success'){
			assemblyLeftNav(data.data);
		}
	},
	error:function(){
		alert('请刷新页面重试');
	}
});


/**
 * 拼装左侧导航结构
 * @param {obj} data 左侧导航数据
 */
function assemblyLeftNav(data){
	var html = '';
	$.each(data, function(i, item){
		if (i == 0){	//第一层默认被选中
			html += '<li class="left-nav__item act">'+
					'<a href="#" class="Pr act" id="' + item.floorid + '">' + item.name;
		} else {
			html += '<li class="left-nav__item">'+
					'<a href="#" class="Pr" id="' + item.floorid + '">' + item.name;
		}
		html += '<i class="iconfont Pa">&#xe640;</i></a>';

		if(item.son.length){ //若有下一级
			html += '<ul class="left-nav__item__list">';
			$.each(item.son, function(i, item){
				if (i == 0){	//第一层默认被选中
					html += '<li><a href="#" id="' + item.floorid + '" class="act">' + item.name + '</a></li>'
				} else {
					html += '<li><a href="#" id="' + item.floorid + '">' + item.name + '</a></li>'
				}
			})
			html +='</ul>';
		}

		html += '</li>';
	})
	$('#left-nav').prepend(html);
};

// 左侧导航栏绑定点击事件
$('#left-nav').on('click', 'a', function(e){
	e.preventDefault();
	var $target = $(e.target), $parent = $target.parent();
	// if ($target.hasClass('act')) return; //防止频繁发送请求

	if ($parent.hasClass('left-nav__item')){ //当选择父级菜单时,若有子菜单，则重定向至第一个子级
		var $child = $parent.find('.left-nav__item__list li');
		if ($child){
			$target = $child.eq(0).children();
		}
	}

	var id = $target.attr('id');
	getFloorDetail(id);
});

/**
 * 获取右侧楼层详细信息
 * @param {number} floorid 楼层id
 */
function getFloorDetail(floorid){
	$.ajax({
		type : "get",
		url : "http://huhuajian.pe.hu/public/index.php/index/index/get_floor_detail",
		data: {floorid: floorid},
		dataType : "jsonp",
		jsonp: "callback",
		jsonpCallback:"h",
		success: function(data){
			if (data.message == 'success'){
				assemblyFloorDetail(data.data);
				console.log('开始拼装楼层数据')
			}
		},
		error:function(){
			alert('请刷新页面重试');
		}
	});
}

/**
 * 拼装右侧楼层详情
 * @param {any} data 楼层详情数据
 */
function assemblyFloorDetail(data){
	var floor = data.floor, material = data.material;
	$('.map__body').html('');
	var html = '';
	html += '<img src="' + floor.parameter + '" class="map__body__bg" id="map"/>';

	$.each(material, function(i, item){
		var info = '{"name":"' + item.name + '","validTime":' + item.validTime + ',"duty":"' + item.duty + '","check":"' + item.check_name + '","lastTime":"' + item.lastTime + '", "lastCheck":"' + item.check_name + '", "type": "' + item.type + '"}',
			className = 'iconfont Pa map__icon map__icon__' + item.type,
			style = 'left: ' + item.xposition + '; top: ' + item.yposition;
			icon = getIcon(item.type);
		if(!item.ifchecked) className += ' undetected';
		if(!item.ifvalid) className += ' invalid';
		html +="<i class='" + className + "' style='" + style + "' data-message='" + info + "'>" + icon + "</i>";
	})
	$('.map__body').html(html);
}

/**
 * 获取对应的iconfont图标
 * @param type 图标类型
 */
function getIcon(type){
	switch(+type){
	case 1:
		return '&#xe673;';
		break;
	case 2:
		return '&#xe7b5;';
		break;
	case 3:
		return '&#xe63f;';
		break;
	case 4:
		return '&#xe61a;';
		break;
	case 5:
		return '&#xe726;';
		break;
	}
}

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

$('.map').on('mouseover','.map__icon',function(){
	var msg = $(this).data('message');
	var lastTime = msg.lastTime || null, checker = msg.lastCheck || null;
	if(lastTime){
		var str = checker + '在' + lastTime +'检查' ;
	} else{
		var str = '该设备还未被检测';
	}

	layer.tips(str, $(this), {
		tips: [1, '#666'] //还可配置颜色
	});
})

$('.map').on('click','.map__icon',function(){
	var msg = $(this).data('message');
	var lastTime = msg.lastTime || '', 
	checker = msg.check || '', duty = msg.duty || '', 
	name = msg.name, validTime = new Date(msg.validTime), 
	type = msg.type;
	
	lastTime = lastTime;
	validTime = format(validTime);
	var imgUrl;
	switch(type){
	case '1':
		imgUrl = './img/hydrant.jpg'
		break;
	case '2':
		imgUrl = './img/hydrant.jpg'
		break;
	case '3':
		imgUrl = './img/hydrant.jpg'
		break;
	case '4':
		imgUrl = './img/hydrant.jpg'
		break;
	case '5':
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
		offset: '40%',
		anim: 2,
		shadeClose: true, //开启遮罩关闭
		content: layerHtml
	});
})