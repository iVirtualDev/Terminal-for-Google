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

	window.controller = $scope;

	$scope.icons = services.map(function(service) {
		var open = function() { service.open(), close(); };
		var badgeText = '';
		var badgeCommand = null;

		switch (service.id) {
			case 'plus':
				badgeText = badge.get(service.id, '');
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
				badgeText = badge.get(service.id, '');
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

	$scope.secure = pref.get('secure');
	$scope.iconOnly = pref.get('icon-only');
	$scope.columns = pref.get('columns');
	$scope.gmailEnabled = pref.get('gmail-enabled');
	$scope.gmailPollEnabled = pref.get('gmail-poll-enabled');
	$scope.gmailPollInterval = pref.get('gmail-poll-interval');
	$scope.readerEnabled = pref.get('reader-enabled');
	$scope.readerPollEnabled = pref.get('reader-poll-enabled');
	$scope.readerPollInterval = pref.get('reader-poll-interval');
	$scope.plusEnabled = pref.get('plus-enabled');
	$scope.plusPollEnabled = pref.get('plus-poll-enabled');
	$scope.plusPollInterval = pref.get('plus-poll-interval');
	$scope.urlshortenerEnabled = pref.get('urlshortener-enabled');
	$scope.shortenButtonEnabled = pref.get('shorten-button-enabled');

	$scope.change = function(key) {
		var event = document.createEvent('Event');
		event.initEvent('pref-saved', false, false);
		event.key = key;
		window.dispatchEvent(event);

		pref.set('secure', $scope.secure);
		pref.set('icon-only', $scope.iconOnly);
		pref.set('columns', +$scope.columns);
		pref.set('gmail-enabled', $scope.gmailEnabled);
		pref.set('gmail-poll-enabled', $scope.gmailPollEnabled);
		pref.set('gmail-poll-interval', +$scope.gmailPollInterval);
		pref.set('reader-enabled', $scope.readerEnabled);
		pref.set('reader-poll-enabled', $scope.readerPollEnabled);
		pref.set('reader-poll-interval', +$scope.readerPollInterval);
		pref.set('plus-enabled', $scope.plusEnabled);
		pref.set('plus-poll-enabled', $scope.plusPollEnabled);
		pref.set('plus-poll-interval', +$scope.plusPollInterval);
		pref.set('urlshortener-enabled', $scope.urlshortenerEnabled);
		pref.set('shorten-button-enabled', $scope.shortenButtonEnabled);
	};

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
			url: chrome.extension.getURL('/views/option.html'),
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
