/*
 * Copyright (c) 2012 Chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT Licence.
 * http://opensource.org/licenses/MIT
 */

var AppEngine = (function() {
	var ctor = function AppEngine() {
		Service.call(this, {
			id: 'appengine',
			name: 'AppEngine',
			url: 'appengine.google.com',
			icon: 'images/goog-app-engine.png'
		});

		pref.watch('icon-only', function(iconOnly) {
			this.badgeText = iconOnly ? '?' : 'status';
		}.bind(this));
	};

	var proto = ctor.prototype = Object.create(Service.prototype);
	proto.constructor = ctor;

	proto.badgeCommand = function badgeCommand(callback) {
		var url = (pref.get('secure') ? 'https://' : 'http://') +
			'code.google.com/status/appengine';
		chrome.tabs.create({url: url, selected: true}, callback);
	};

	return ctor;
}());
