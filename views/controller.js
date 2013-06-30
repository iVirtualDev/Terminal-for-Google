/*
 * (C) 2012-2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

function Controller($scope, i18n) {
	$scope.MSG_OPTIONS_PAGE = i18n('options_page');
	$scope.MSG_OPTIONS = i18n('options');
	$scope.MSG_SERVICES = i18n('services');
	$scope.MSG_ABOUT = i18n('about');
	$scope.MSG_SECURITY = i18n('security');
	$scope.MSG_USE_SSL = i18n('use_ssl');
	$scope.MSG_APPEARANCE = i18n('appearance');
	$scope.MSG_SHOW_ICON_ONLY = i18n('show_icon_only');
	$scope.MSG_COLUMNS = i18n('columns');
	$scope.MSG_DRAG_AND_DROP = i18n('drag_and_drop');
	$scope.MSG_CHECK_UNREAD_COUNT = i18n('check_unread_count');
	$scope.MSG_ENABLE_CONTEXTUAL_MENU_IN_WEB_PAGES =
		i18n('enable_contextual_menu_in_web_pages');
	$scope.MSG_ENABLE_CONTEXTUAL_MENU_IN_LINKS =
		i18n('enable_contextual_menu_in_links');
	$scope.MSG_ENABLE_CONTEXTUAL_MENU_IN_TEXT =
		i18n('enable_contextual_menu_in_text');
	$scope.MSG_ENABLE_SHORTEN_BUTTON = i18n('enable_shorten_button');
	$scope.MSG_BEFORE_TIMING = i18n('before_timing');
	$scope.MSG_AFTER_TIMING = i18n('after_timing');
	$scope.MSG_SAVED = i18n('saved');

	$scope.minutesMsg = function(value) {
		return i18n('minutes', [value + '']);
	};

	$scope.allTheImagesAreProvidedByMsg = function(person, webPage) {
		return i18n('all_the_images_are_provided_by',
			['<a href="' + webPage + '">' + person + '</a>']);
	};

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
