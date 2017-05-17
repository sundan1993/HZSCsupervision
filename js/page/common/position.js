$.position = function(parentId , event){
	var e = event || window.event;
	var parentX = $('#'+ parentId).offset().left, parentY = $('#'+ parentId).offset().top;
	var childX = event.pageX, childY = event.pageY;
	var x = childX - parentX, y = childY - parentY;
	console.log('left: '+ x +'px; top: ' + y + 'px');
}