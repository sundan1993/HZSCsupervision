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
	if ($target.hasClass('act')) return; //防止频繁发送请求

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
		html += '<i class="iconfont Pa map__icon map__icon__2 invalid" style="left: 677px; top: 106px" data-message='{"name":"＃1号手提式灭火器","validTime":1562725272000,"duty":"王卫东","check":"汪树松，季必成","lastTime":1492497471604, "lastCheck":"汪树松，季必成", "type": "2"}'>&#xe7b5;</i>';
	})
	$('.map__body').html(html);
}