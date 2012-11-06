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
		return {
			id: service.id,
			enabled: service.isEnabled,
			name: service.name,
			image: chrome.extension.getURL(service.icon),
			badgeText: service.badgeText == null ? '' : service.badgeText,
			badgeCommand: function badgeCommand() {
				if (service.badgeCommand != null)
					service.badgeCommand(close);
			},
			open: function open() {
				service.open();
				close();
			}
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
		dispatchSaveEvent(key);

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

	$scope.mailPageEnabled = pref.get('mail-page-enabled');
	$scope.mailPageEnabledChange = function() {
		pref.set('mail-page-enabled', $scope.mailPageEnabled);
		dispatchSaveEvent('mail-page-enabled');
	};

	$scope.mailLinkEnabled = pref.get('mail-link-enabled');
	$scope.mailLinkEnabledChange = function() {
		pref.set('mail-link-enabled', $scope.mailLinkEnabled);
		dispatchSaveEvent('mail-link-enabled');
	};

	$scope.mailTextEnabled = pref.get('mail-text-enabled');
	$scope.mailTextEnabledChange = function() {
		pref.set('mail-text-enabled', $scope.mailTextEnabled);
		dispatchSaveEvent('mail-text-enabled');
	};

	$scope.blogEnabled = pref.get('blog-enabled');

	$scope.blogPageEnabled = pref.get('blog-page-enabled');
	$scope.blogPageEnabledChange = function() {
		pref.set('blog-page-enabled', $scope.blogPageEnabled);
		dispatchSaveEvent('blog-page-enabled');
	};

	$scope.blogLinkEnabled = pref.get('blog-link-enabled');
	$scope.blogLinkEnabledChange = function() {
		pref.set('blog-link-enabled', $scope.blogLinkEnabled);
		dispatchSaveEvent('blog-link-enabled');
	};

	$scope.blogTextEnabled = pref.get('blog-text-enabled');
	$scope.blogTextEnabledChange = function() {
		pref.set('blog-text-enabled', $scope.blogTextEnabled);
		dispatchSaveEvent('blog-text-enabled');
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

	function dispatchSaveEvent(key) {
		var event = document.createEvent('Event');
		event.initEvent('pref-saved', false, false);
		event.key = key;
		window.dispatchEvent(event);
	}
}
