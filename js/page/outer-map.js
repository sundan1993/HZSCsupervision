//初始化左侧列表
$.ajax({
	type : "get",
	url : "http://huhuajian.pe.hu/public/index.php/index/index/get_left_list",
	async:false,
	dataType : "jsonp",
	jsonp: "callback",
	jsonpCallback:"h",
	success: function(data){
		if (data.code == 1){
			assemblyLeftNav(data.data);
		} else {
			alert('请刷新页面重试');
		}
	},
	error:function(){
		alert('请刷新页面重试');
	}
});

//初始化右侧设备
$.ajax({
	type : "get",
	url : "http://huhuajian.pe.hu/public/index.php/index/index/get_index_list",
	dataType : "jsonp",
	jsonp: "callback",
	data: {floorid: -1},
	jsonpCallback:"l",
	success: function(data){
		if (data.code == 1){
			assemblyFloorDetail(data.data);
		} else {
			alert('请刷新页面重试');
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
		html += '<li class="left-nav__item">'+
				'<a href="#" class="Pr" id="' + item.floorid + '">' + item.name +
				'<i class="iconfont Pa">&#xe640;</i></a>';

		if(item.son.length){ //若有下一级
			html += '<ul class="left-nav__item__list">';
			$.each(item.son, function(i, item){
				if (i == 0){	//第一层默认被选中
					html += '<li class="act"><a href="#" id="' + item.floorid + '">' + item.name + '</a></li>'
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
	var id = $target.attr('id');
	window.location.href = './inner-map.html?id=' + id;
});


/**
 * 拼装右侧楼层详情
 * @param {any} data 楼层详情数据
 */
function assemblyFloorDetail(data){
	var html = '';
	var materialType = [];

	$.each(data, function(i, item){
		if(materialType.indexOf(item.type) == -1){ //数组去重
			materialType.push(item.type);
		}

		var info = '{"name":"' + item.name + '","validTime":' + item.validTime + ',"duty":"' + item.duty + '","check":"' + item.check_name + '","lastTime":"' + item.lastTime + '", "lastCheck":"' + item.last_check_name + '", "type": "' + item.type + '"}',
			className = 'iconfont Pa map__icon map__icon__' + item.type,
			style = 'left: ' + item.xposition + '; top: ' + item.yposition;
			icon = getMaterialIcon(item.type);
		if(!item.ifchecked) className += ' undetected';
		if(!item.ifvalid) className += ' invalid';
		html +="<i class='" + className + "' style='" + style + "' data-message='" + info + "'>" + icon + "</i>";
	})
	$('.map__body').append(html);
	updateFilter(materialType);
}

/**
 * 获取设备对应的iconfont图标
 * @param type 设备类型
 */
function getMaterialIcon(type){
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

/**
 * 获取对应的设备名称
 * @param type 设备类型
 */
function getMaterialName(type){
	switch(+type){
	case 1:
		return '手推式灭火器';
		break;
	case 2:
		return '手提式灭火器';
		break;
	case 3:
		return '消防栓';
		break;
	case 4:
		return '报警按钮';
		break;
	case 5:
		return '进水栓';
		break;
	}
}

//根据Unix时间戳获取时间
function format(timestamp){
	var time = new Date(timestamp*1000);
	var y = time.getFullYear();
	var m = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var mm = time.getMinutes();
	var s = time.getSeconds();
	return y + '年' + m + '月' + d + '日';
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


/**
 * 更新顶部设备筛选
 * @param {any} materialType 设备类型列表
 */
function updateFilter(materialType){
	$('.map__top__filter .map__top__filter__btn').remove();
	var html = '';
	$.each(materialType, function(i, item){
		var icon = getMaterialIcon(item); //获取对应图标；
		var name = getMaterialName(item); //获取对应设备名称；
		html += '<span class="map__top__filter__btn act" data-type="' + item + '">' +
				'<i class="iconfont">' + icon + '</i>' + name + '</span>';
	})
	$('.map__top__filter').append(html);
	updateMaterialTotal();
}

/**
 * 获取设备总数
 **/
function updateMaterialTotal(){
	var total = $('.map__icon:visible').length;
	var undetected = $('.map__icon.undetected:visible').length;
	var invalid = $('.map__icon.invalid:visible').length;
	var str = '共有' + total + '个设备：有效' + (total - undetected - invalid) + '个，未检' + undetected + '个，失效' + invalid + '个';
	$('.map__top__filter__total').html(str);
}

$('.map__top__filter').on('click', '.map__top__filter__btn', function(){
	var type = $(this).data('type');
	$(this).toggleClass('act');
	$('.map__icon__' + type).toggleClass('hide');
	updateMaterialTotal();
})

// 导航跟随滚动
function scrollNav(){
	var scroll=$(window).scrollTop();//当前滚动条滚动的距离
	var Top=scroll+$(window).height();//真正文档滚动的高度
	if(Top > $('html').height()) return;
	if (scroll>=400) {   //顶部距离的高度400
		$('#top-nav').addClass('srcoll');
		$('#left-nav').css('top',scroll- 400 + 50 +'px');
	}else{
		$('#top-nav').removeClass('srcoll');
		$('#left-nav').css('top', 0);
	}
}
scrollNav();
$(window).bind('resize scroll',scrollNav);