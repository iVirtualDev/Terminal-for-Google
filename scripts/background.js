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
		'reader-poll-interval': 1000 * 60 * 5,
		'reader-poll-enabled': true,
		'blog-page-enabled': true,
		'blog-link-enabled': true,
		'blog-text-enabled': true,
		'urlshortener-enabled': false,
		'shorten-button-enabled': true,
		'music-enabled': false,
		'knol-enabled': false,
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


var badge = {
	_listener: [],
	onPropertyChange: {
		addListener: function(listener){
			badge._listener.push(listener);
		},
		removeListener: function(listener){
			var i = badge._listener.indexOf(listener);
			if(i > -1)
				badge._listener.splice(i, 1);
		},
		hasListener: function(){
			return badge._listener.indexOf(listener) !== -1;
		}
	},
	_gmail: null,
	_reader: null,
	_plus: null,
	setColor: function(r, g, b, a){
		chrome.browserAction.setBadgeBackgroundColor({
			color: [
				Math.min(r, 255),
				Math.min(g, 255),
				Math.min(b, 255),
				Math.min(a, 255)
			]
		});
	},
	setText: function(text){
		chrome.browserAction.setBadgeText({text: text || ''});
	},
	refresh: function(){
		var r = 0, g = 0, b = 0, text = null;
		
		if(this._gmail){
			r += 208;
			b += 24;
			text = this._gmail;
		}
		
		if(this._reader){
			g += 24;
			b += 208;
			text = text? '!': this._reader;
		}

		if(this._plus){
			r += 255;
			g += 8;
			b += 8;
			text = text? '!': this._plus;
		}

		if(r > 255)
			r = 255;
		if(g > 255)
			g = 255;
		if(b > 255)
			b = 255;
		
		this.setColor(r, g, b, 255);
		this.setText(text);
		
		this._listener.forEach(function(listener){
			listener.call(badge);
		});
	},
	get gmail(){
		return this._gmail;
	},
	set gmail(value){
		this._gmail = (value == 0 || value == null)? null: String(value);
		this.refresh();
	},
	get reader(){
		return this._reader;
	},
	set reader(value){
		this._reader = (value == 0 || value == null)? null: String(value);
		this.refresh();
	},
	get plus(){
		return this._plus;
	},
	set plus(value){
		this._plus = (value == 0 || value == null)? null: String(value);
		this.refresh();
	}
};

badge.onPropertyChange.addListener(function(){
	var e = document.createEvent('Event');
	e.initEvent('badge-changed', false, false);
	e.value = badge;
	chrome.extension.getViews().forEach(function(view){
		view.dispatchEvent(e);
	});
});


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
