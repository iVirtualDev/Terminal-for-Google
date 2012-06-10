
// Draw a triangle.
void function(){
	var context = document.getCSSCanvasContext('2d', 'triangle', 20, 20);

	context.fillStyle = '#888';
	context.beginPath();
	context.moveTo(0, 6);
	context.lineTo(0, 14);
	context.lineTo(6.9, 10);
	context.lineTo(0, 6);
	context.fill();
}();


// Page UI.
window.addEventListener('load', function(){
	var update = function(){
		var hash = location.hash;
		var li = document.querySelector(
			'#nav-list > li[data-nav=\\' + hash + ']');

		if(!!li){
			var selected = document.querySelector('#nav-list > li.selected');
			if(selected)
				selected.classList.remove('selected');
			li.classList.add('selected');
		}
	};

	window.addEventListener('hashchange', update);

	if(document.querySelector('iframe:target'))
		update();
	else
		location.replace('#policy');
});
