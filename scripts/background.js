/*
 * Copyright (c) 2012 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

var pref = new Preference({
	prefix: 'pref-',
	defaultValues: {
		'secure': true,
		'icon-only': false,
		'secure': true,
		'icon-only': false,
		'columns': 3,
		'voice-enabled': false,
		'bookmarks-enabled': false,
		'gmail-poll-interval': 1000 * 60 * 5,
		'gmail-poll-enabled': true,
		'mail-page-enabled': true,
		'mail-link-enabled': true,
		'mail-text-enabled': true,
		'blog-page-enabled': true,
		'blog-link-enabled': true,
		'blog-text-enabled': true,
		'urlshortener-enabled': false,
		'shorten-button-enabled': true,
		'music-enabled': false,
		'finance-enabled': false,
		'moderator-enabled': false,
		'books-enabled': false,
		'webstore-enabled': false,
		'plus-enabled': false,
		'plus-poll-enabled': true,
		'plus-poll-interval': 1000 * 60 * 5,
		'panoramio-enabled': false,
		'scholar-enabled': false
	},
	onChange: function(data) {
		var event = document.createEvent('Event');
		event.initEvent('pref-changed', false, false);
		event.key = data.key;
		event.value = data.value;

		chrome.extension.getViews().forEach(function(view){
			view.dispatchEvent(event);
		});
	}
});


var badge = new Badge(['gmail', 'plus']);
badge.setColor('gmail', [255, 16, 16]);
badge.setColor('plus', [255, 16, 16]);


window.addEventListener('unload', function() {
	chrome.contextMenus.removeAll();
});


// Execute content script to make context menus work right after install.
var contentScript = 'scripts/content.js';
chrome.windows.getAll({populate: true}, function(windows) {
	windows.forEach(function(window_) {
		window_.tabs.forEach(function(tab) {
			if (!/^https?:\/\//.test(tab.url || ''))
				return;
			chrome.tabs.executeScript(tab.id, {file: contentScript});
		});
	});
});
