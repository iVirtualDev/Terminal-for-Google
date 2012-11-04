/*
 * Copyright (c) 2012 Chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT Licence.
 * http://opensource.org/licenses/MIT
 */

// Draw a triangle to a CSS canvas.
void function() {
	var context = document.getCSSCanvasContext('2d', 'triangle', 20, 20);
	context.fillStyle = '#888';
	context.beginPath();
	context.moveTo(0, 6);
	context.lineTo(0, 14);
	context.lineTo(6.9, 10);
	context.lineTo(0, 6);
	context.fill();
}();

window.addEventListener('load', function() {
	if (document.querySelector('#contents > div:target'))
		update();
	else
		location.replace('#icon-lists');

	window.addEventListener('hashchange', update);

	function update() {
		var li = document.querySelector(
			'#nav-list > li[data-nav=\\' + location.hash + ']');
		if (!!li) {
			var selected = document.querySelector('#nav-list > li.selected');
			if (selected)
				selected.classList.remove('selected');
			li.classList.add('selected');
		}
	}
});

window.addEventListener('DOMContentLoaded', function() {
	document.addEventListener('click', function(event) {
		var target = event.target;
		if (target.nodeName.toLowerCase() === 'a' &&
			target.href.indexOf(chrome.extension.getURL('')) !== 0) {
			chrome.tabs.create({url: target.href, selected: true});
			event.preventDefault();
		}
	});
});

void function() {
	var timeoutIds = {};
	window.top.addEventListener('pref-saved', function(event) {
		var key = event.key;
		var msg = document.querySelector('.msg[data-key~=' + key + ']');
		if (!!msg) {
			if (!timeoutIds[key]) {
				msg.classList.add('saved');
				timeoutIds[key] = setTimeout(function() {
					timeoutIds[key] = null;
					msg.classList.remove('saved');
				}, 100 + 1500);
			} else {
				clearTimeout(timeoutIds[key]);
				msg.classList.remove('saved');
				timeoutIds[key] = setTimeout(function() {
					timeoutIds[key] = null;
					listener(event);
				}, 100);
			}
		}
	});
}();

// Drag and drop.
window.addEventListener('DOMContentLoaded', function(){
	var backgroundPage = chrome.extension.getBackgroundPage();
	var services = backgroundPage.services;
	var pref = backgroundPage.pref;
	var enabledServices = document.querySelector('#enabled-services');
	var disabledServices = document.querySelector('#disabled-services');
	var preventDefault = function(event) { event.preventDefault(); };
	var controller = window.controller;

	document.addEventListener('dragstart', function(event) {
		var target = event.target;
		if (!target.classList.contains('icon'))
			return;
		document.body.classList.add('dragging');
		event.dataTransfer.setData('text', target.dataset.id);
	});

	document.addEventListener('dragend', function() {
		document.body.classList.remove('dragging');
	});

	enabledServices.addEventListener('dragenter', preventDefault);
	enabledServices.addEventListener('dragover', preventDefault);
	enabledServices.addEventListener('drop', function(event) {
		event.preventDefault();
		var serviceId = event.dataTransfer.getData('text');
		var target = event.target;
		while (!target.classList.contains('icon') &&
			target !== enabledServices) {
			target = target.parentElement;
		}
		reorder(serviceId,
			target.classList.contains('icon') ? target.dataset.id : null);
		toggle(serviceId, true);
		controller.$digest();
	});

	disabledServices.addEventListener('dragenter', preventDefault);
	disabledServices.addEventListener('dragover', preventDefault);
	disabledServices.addEventListener('drop', function(event) {
		event.preventDefault();
		var serviceId = event.dataTransfer.getData('text');
		var target = event.target;
		while (!target.classList.contains('icon') &&
			target !== disabledServices) {
			target = target.parentElement;
		}
		reorder(serviceId,
			target.classList.contains('icon') ? target.dataset.id : null);
		toggle(serviceId, false);
		controller.$digest();
	});

	function reorder(id, targetId) {
		if (id === targetId)
			returnk
		var i, j;
		controller.icons.forEach(function(icon, n) {
			if (icon.id === id)
				i = n;
			else if (icon.id === targetId)
				j = n;
		});
		if (j == null)
			j = controller.icons.length;
		if (i + 1 === j || !(i < j)) {
			var icon = controller.icons.splice(i, 1)[0];
			controller.icons.splice(j, 0, icon);
		} else {
			if (controller.icons[j] &&
				controller.icons[i].enabled === controller.icons[j].enabled)
				j += 1;
			controller.icons.splice(j, 0, controller.icons[i]);
			controller.icons.splice(i, 1);
		}
		pref.set('service-order', controller.icons.map(function(icon) {
			return icon.id;
		}));
	}

	function toggle(id, enabled) {
		services.some(function(service) {
			if (service.id !== id)
				return false;
			enabled ? service.enable() : service.disable();
			if (id + 'Enabled' in controller) {
				controller[id + 'Enabled'] = enabled;
				var event = document.createEvent('Event');
				event.initEvent('pref-saved', false, false);
				event.key = id + '-enabled';
				window.dispatchEvent(event);
			}
			controller.icons.some(function(icon) {
				if (icon.id !== id)
					return false;
				icon.enabled = enabled;
				return true;
			});
			return true;
		});
	}
});
