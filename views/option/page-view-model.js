
window.addEventListener('load', function(){
	window.dataContext = top.dataContext;
	top.iggy.initialize(document, dataContext);
});
