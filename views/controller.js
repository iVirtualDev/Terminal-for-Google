/*
 * Copyright (c) 2012 Chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT Licence.
 * http://opensource.org/licenses/MIT
 */

function Controller($scope) {
	var backgroundPage = chrome.extension.getBackgroundPage();
	var pref = backgroundPage.pref;
	var badge = backgroundPage.badge;
	var services = backgroundPage.services;
	var order = pref.get('service-order', []);

	var close = window.close.bind(window);

	$scope.icons = services.map(function(service) {
		var open = function() { service.open(), close(); };
		var badgeText = '';
		var badgeCommand = null;

		switch (service.id) {
			case 'plus':
				badgeText = badge[service.id] || '';
				if (pref.get('icon-only') && 99 < badgeText)
					badgeText = '!';
				badgeCommand = function() {
					var url = 'plus.google.com/notifications/all';
					chrome.tabs.create({
						url: url,
						selected: true
					}, close);
				};
				break;
			case 'gmail':
			case 'reader':
				badgeText = badge[service.id] || '';
				if (pref.get('icon-only') && 99 < badgeText)
					badgeText = '!';
				badgeCommand = open;
				break;
			case 'appengine':
				badgeText = pref.get('icon-only') ? '?' : 'status';
				badgeCommand = function() {
					var url = (pref.get('secure') ? 'https://' : 'http://') +
						'code.google.com/status/appengine';
					chrome.tabs.create({
						url: url,
						selected: true
					}, close);
				};
				break;
			case 'urlshortener':
				if (!pref.get('shorten-button-enabled'))
					break;
				badgeText = pref.get('icon-only') ? '+' : 'shorten';
				badgeCommand = shortenURL.bind(null, close);
				break;
		}

		return {
			id: service.id,
			enabled: service.isEnabled,
			name: service.name,
			image: '/' + service.icon,
			badgeText: badgeText,
			badgeCommand: badgeCommand,
			open: open
		};
	}).sort(function(a, b) {
		return order.indexOf(a.id) - order.indexOf(b.id);
	});

	$scope.iconOnly = pref.get('icon-only');

	$scope.columns = pref.get('columns');

	$scope.openAppsDashboard = function() {
		chrome.tabs.create({
			url: 'http://www.google.com/appsstatus',
			selected: true
		}, function() {
			window.close();
		});
	};

	$scope.openOptionPage = function() {
		chrome.tabs.create({
			url: chrome.extension.getURL('/views/option/index.html'),
			selected: true
		}, function() {
			window.close();
		});
	};

	function shortenURL(callback) {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.create({
				url: 'http://goo.gl',
				selected: true
			}, function(newTab) {
				execute(tab, newTab);
			});
		});

		function execute(tab, newTab) {
			var code = 'void ' + function() {
				if (window.document && document.readyState === 'complete')
					a();
				else
					window.addEventListener('load', a);
				function a() {
					setTimeout(function() {
						document.querySelector('input[type=text]').value =
							"%TAB_URL%";
					}, 2000);
				}
			}.toString().replace('%TAB_URL%', tab.url) + '()';

			chrome.tabs.executeScript(newTab.id, {code: code});
			callback();
		}
	}
}
