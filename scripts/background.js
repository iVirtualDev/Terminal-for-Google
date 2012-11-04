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
		'reader-poll-interval': 1000 * 60 * 5,
		'reader-poll-enabled': true,
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

var badge = new Badge({
	keys: {
		gmail: {color: [208, 0, 24]},
		reader: {color: [0, 24, 208]},
		plus: {color: [255, 8, 8]}
	}
});
