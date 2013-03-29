/*
 * Copyright (c) 2012 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

var Service = (function() {
	var ctor = function Service(args) {
		Object.defineProperties(this, {
			id: {value: args.id},
			name: {value: args.name},
			url: {value: args.url},
			icon: {value: args.icon || 'images/goog-logo.png'},
			urlContainsScheme: {value: /^[a-z]+:/.test(args.url)},
			onEnabled: {value: []},
			onDisabled: {value: []},
			isEnabled: {value: false, writable: true}
		});

		// Call this.enable() asynchronously, if this service has been enabled.
		if(pref.get(args.id + '-enabled', true)){
			var channel = new MessageChannel();
			channel.port1.postMessage(0);
			channel.port2.onmessage = function(){
				this.enable();
			}.bind(this);
		}

		var menus = args.menus || [];
		menus.forEach(function(menu){
			var menuId = null;

			pref.watch([
				args.id + '-enabled',
				menu.id + '-enabled'
			], function(serviceEnabled, menuEnabled) {
				if (serviceEnabled && menuEnabled) {
					if (menuId === null) {
						menuId = chrome.contextMenus.create({
							type: menu.type || 'normal',
							title: menu.title,
							contexts: [menu.context],
							onclick: function(info, tab) {
								chrome.tabs.sendRequest(tab.id, {
									id: menu.id,
									text: info.selectionText,
									link: info.linkUrl
								});
							}
						});
					}
				} else if (menuId !== null) {
					chrome.contextMenus.remove(menuId);
					menuId = null;
				}
			});
		});
	};

	var proto = ctor.prototype = {};
	proto.constructor = ctor;

	proto.enable = function enable() {
		if(this.isEnabled)
			return;

		this.isEnabled = true;
		pref.set(this.id + '-enabled', true);

		// Emit onEnabled event.
		this.onEnabled.forEach(function(onEnabled){
			onEnabled.call(this);
		}, this);
	};

	proto.disable = function disable() {
		if(!this.isEnabled)
			return;

		this.isEnabled = false;
		pref.set(this.id + '-enabled', false);

		// Emit onDisabled event.
		this.onDisabled.forEach(function(onDisabled){
			onDisabled.call(this);
		}, this);
	};

	proto.suggest = function suggest(input) {
		if (input === this.id)
			return 0;
		var text = [
			this.id,
			this.name,
			this.getFullUrl()
		].join('\n\n').toLowerCase();
		var index = text.indexOf(input);
		if (index === -1)
			return -1;
		return 1 + index;
	};

	proto.getFullUrl = function getFullUrl() {
		return this.urlContainsScheme? this.url:
			(pref.get('secure')? 'https://': 'http://') + this.url;
	};

	proto.open = function open() {
		var url = this.getFullUrl();

		chrome.tabs.getAllInWindow(null, function(tabs){
			// If the service page has opened, select its tab.
			for(var i = 0, tab; tab = tabs[i]; i++){
				if(tab.url && tab.url.indexOf(url) === 0){
					chrome.tabs.update(tab.id, {selected: true});
					return;
				}
			}

			// Create a new tab.
			chrome.tabs.create({url: url, selected: true});
		});
	};

	return ctor;
}());


var serviceInfo = [{
	id: 'gmail'
}, {
	id: 'calendar',
	name: 'Google Calendar',
	url: 'www.google.com/calendar',
	icon: 'images/goog-cal.png'
}, {
	id: 'reader'
}, {
	id: 'contacts',
	name: 'Contacts',
	url: 'www.google.com/contacts',
	icon: 'images/goog-contacts.png'
}, {
	id: 'tasks',
	name: 'Tasks',
	url: 'mail.google.com/tasks/canvas',
	icon: 'images/goog-tasks.png'
}, {
	id: 'docs',
	name: 'Google Drive',
	url: 'drive.google.com',
	icon: 'images/goog-docs.png'
}, {
	id: 'sites',
	name: 'Google Sites',
	url: 'sites.google.com',
	icon: 'images/goog-sites.png'
}, {
	id: 'analytics',
	name: 'Analytics',
	url: 'www.google.com/analytics/settings/home',
	icon: 'images/goog-analytics.png'
}, {
	id: 'tools',
	name: 'Webmaster Tools',
	url: 'www.google.com/webmasters/tools/home',
	icon: 'images/goog-webmaster.png'
}, {
	id: 'feed',
	name: 'FeedBurner',
	url: 'feedburner.google.com',
	icon: 'images/goog-feedburner.png'
}, {
	id: 'blog',
	name: 'Blogger',
	url: 'www.blogger.com/home',
	icon: 'images/goog-blogger.png',
	menus: [
		{
			title: 'Blog this page',
			context: 'page',
			id: 'blog-page'
		},
		{
			title: 'Blog this link',
			context: 'link',
			id: 'blog-link'
		},
		{
			title: 'Blog this text',
			context: 'selection',
			id: 'blog-text'
		}
	]
}, {
	id: 'adsense',
	name: 'Adsense',
	url: 'www.google.com/adsense',
	icon: 'images/goog-adsense-old.png'
}, {
	id: 'appengine'
}, {
	id: 'picasa',
	name: 'Picasa',
	url: 'picasaweb.google.com/home',
	icon: 'images/goog-picasa.png'
}, {
	id: 'youtube',
	name: 'YouTube',
	url: 'www.youtube.com',
	icon: 'images/goog-you-tube.png'
}, {
	id: 'dashboard',
	name: 'Dashboard',
	url: 'https://www.google.com/dashboard/'
}, {
	id: 'accounts',
	name: 'Accounts',
	url: 'https://www.google.com/accounts/',
	icon: 'images/goog-account-settings.png'
}, {
	id: 'news',
	name: 'Google News',
	url: 'news.google.com',
	icon: 'images/goog-news.png'
}, {
	id: 'maps',
	name: 'Google Maps',
	url: 'maps.google.com',
	icon: 'images/goog-maps.png'
}, {
	id: 'android',
	name: 'Google Play',
	url: 'https://play.google.com/store',
	icon: 'images/google-play.png'
}, {
	id: 'groups',
	name: 'Google Groups',
	url: 'groups.google.com',
	icon: 'images/goog-groups-old.png'
}, {
	id: 'igoogle',
	name: 'iGoogle',
	url: 'http://www.google.com/ig',
	icon: 'images/goog-igoogle-old.png'
}, {
	id: 'translate',
	name: 'Google Translate',
	url: 'http://translate.google.com/',
	icon: 'images/goog-translate.png'
}, {
	id: 'voice',
	name: 'Google Voice',
	url: 'http://www.google.com/voice',
	icon: 'images/goog-voice-new.png'
}, {
	id: 'bookmarks',
	name: 'Google Bookmarks',
	url: 'http://www.google.com/bookmarks',
	icon: 'images/goog-bookmarks.png'
}, {
	id: 'urlshortener'
}, {
	id: 'music',
	name: 'music beta',
	url: 'music.google.com/music/',
	icon: 'images/goog-music-o.png'
}, {
	id: 'knol',
	name: 'Knol',
	url: 'http://knol.google.com/k',
	icon: 'images/goog-knol.png'
}, {
	id: 'finance',
	name: 'Google finance',
	url: 'www.google.com/finance',
	icon: 'images/goog-finance-g.png'
}, {
	id: 'moderator',
	name: 'Google Moderator',
	url: 'www.google.com/moderator',
	icon: 'images/goog-moderator.png'
}, {
	id: 'books',
	name: 'Google Books',
	url: 'http://books.google.com',
	icon: 'images/goog-books.png'
}, {
	id: 'webstore',
	name: 'Chrome Web\xA0Store',
	icon: 'images/chrome-web-store.png',
	url: 'https://chrome.google.com/webstore'
}, {
	id: 'plus'
}, {
	id: 'panoramio',
	name: 'Panoramio',
	url: 'http://www.panoramio.com',
	icon: 'images/goog-panoramio-old.png'
}, {
	id: 'scholar',
	name: 'Google Scholar',
	url: 'http://scholar.google.com',
	icon: 'images/scholar-64.png'
}];


var services;
window.addEventListener('load', function(){
	services = serviceInfo.map(function(args){
		switch(args.id){
			case 'gmail': return new Gmail();
			case 'reader': return new GoogleReader();
			case 'plus': return new GooglePlus();
			case 'appengine': return new AppEngine();
			case 'urlshortener': return new UrlShortener();
			default: return new Service(args);
		}
	});
});
