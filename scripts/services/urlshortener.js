/*
 * Copyright (c) 2012 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

var UrlShortener = (function() {
	var ctor = function UrlShortener() {
		Service.call(this, {
			id: 'urlshortener',
			name: 'Google URL Shortener',
			url: 'http://goo.gl'
		});

		pref.watch([
			'shorten-button-enabled',
			'icon-only'
		], function(enabled, iconOnly) {
			this.badgeText = !enabled ? '' : iconOnly ? '+' :
				chrome.i18n.getMessage('shorten');
		}.bind(this));
	};

	var proto = ctor.prototype = Object.create(Service.prototype);
	proto.constructor = ctor;

	proto.badgeCommand = function badgeCommand(callback) {
		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.create({
				url: 'http://goo.gl',
				selected: true
			}, function(newTab) {
				this.shortenUrl(newTab.id, tab.url, callback);
			}.bind(this));
		}.bind(this));
	};

	proto.shortenUrl = function shortenUrl(tabId, url, callback) {
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
		}.toString().replace('%TAB_URL%', url) + '()';
		chrome.tabs.executeScript(tabId, {code: code});
		callback();
	};

	return ctor;
}());
