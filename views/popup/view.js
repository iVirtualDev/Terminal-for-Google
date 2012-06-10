
window.addEventListener('load', function(){
	// Disable context menus.
	document.addEventListener('contextmenu', function(event){
		event.preventDefault();
	});

	document.querySelector('ul').addEventListener('click', function(event){
		var target = event.target;
		if(!target.webkitMatchesSelector('li.service, li.service *'))
			return;

		while(!target.classList.contains('service'))
			target = target.parentElement;

		var event = document.createEvent('Event');
		event.initEvent('click', false, false);
		target.firstElementChild.dispatchEvent(event);
	});
});
