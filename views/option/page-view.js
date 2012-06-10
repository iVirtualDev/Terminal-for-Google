
window.addEventListener('load', function(){
	document.addEventListener('click', function(event){
		if(!!event.target.href){
			chrome.tabs.create({url: event.target.href});
			event.preventDefault();
		}
	}, false);
});


window.top.addEventListener('pref-saved', function listener(event){
	var key = event.key;
	var msg = document.querySelector('.msg[data-key~=' + key + ']');
	if(!msg)
		return;

	var timeoutIds = listener.timeoutIds || (listener.timeoutIds = {});

	if(!timeoutIds[key]){
		msg.classList.add('saved');
		timeoutIds[key] = setTimeout(function(){
			timeoutIds[key] = null;
			msg.classList.remove('saved');
		}, 100 + 1500);
	}else{
		clearTimeout(timeoutIds[key]);
		msg.classList.remove('saved');
		timeoutIds[key] = setTimeout(function(){
			timeoutIds[key] = null;
			listener(event);
		}, 100);
	}
});


// Drag and drop.
window.addEventListener('load', function(){
	var enabledServices = document.querySelector('#enabled-services');
	var disabledServices = document.querySelector('#disabled-services');

	if(enabledServices === null || disabledServices === null)
		return;

	document.addEventListener('dragstart', function(event){
		var target = event.target;
		if(!target.classList.contains('service'))
			return;
		document.body.classList.add('dragging');
		event.dataTransfer.setData('text', target.dataset.serviceId);
	});

	document.addEventListener('drop', function(event){
		document.body.classList.remove('dragging');
	});

	enabledServices.addEventListener('dragenter', function(event){
		event.preventDefault();
	});

	enabledServices.addEventListener('dragover', function(event){
		event.preventDefault();
	});

	enabledServices.addEventListener('drop', function(event){
		event.preventDefault();

		var serviceId = event.dataTransfer.getData('text');
		var target = event.target;
		reorder(serviceId, target,
			dataContext.disabledServices, dataContext.enabledServices);
	});

	disabledServices.addEventListener('dragenter', function(event){
		event.preventDefault();
	});

	disabledServices.addEventListener('dragover', function(event){
		event.preventDefault();
	});

	disabledServices.addEventListener('drop', function(event){
		event.preventDefault();

		var serviceId = event.dataTransfer.getData('text');
		var target = event.target;
		reorder(serviceId, target,
			dataContext.enabledServices, dataContext.disabledServices);
	});

	function reorder(serviceId, target, droppedList, theOtherList){
		var list1 = droppedList;
		var list2 = theOtherList;

		var index = list1.find(function(service){
			return service.id === serviceId;
		});

		if(index === -1){
			index = list2.find(function(service){
				return service.id === serviceId;
			});

			if(index === -1)
				return;

			list1 = list2;
		}else{
			item = list1.get(index);
		}

		var item = list1.get(index);

		if(target.webkitMatchesSelector('li, li *')){
			while(!target.classList.contains('service'))
				target = target.parentElement;

			var targetId = target.dataset.serviceId;
			var targetIndex = list2.find(function(service){
				return service.id === targetId;
			});

			if(targetIndex === -1)
				targetIndex = index;

			list1.removeAt(index);
			list2.insert(targetIndex, item);
		}else{
			list1.removeAt(index);
			list2.append(item);
		}
	}
});
