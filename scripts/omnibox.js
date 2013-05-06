/*
 * Copyright (c) 2012 Chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT Licence.
 * http://opensource.org/licenses/MIT
 */

void function() {
	var IGNORE_REGEXP = /^google|\s+/ig;

	chrome.omnibox.setDefaultSuggestion({
		description: 'Access to Google Services'
	});

	chrome.omnibox.onInputEntered.addListener(function(input) {
		var services = getSuggestions(input);
		chrome.tabs.getSelected(null, function(tab) {
			var url = 0 < services.length ? services[0].getFullUrl() :
				'http://www.google.com/search?q=' + encodeURIComponent(input);
			if (tab.url === 'chrome://newtab/') {
				chrome.tabs.update(tab.id, {selected: true, url: url});
			} else {
				chrome.tabs.create({selected: true, url: url});
			}
		});
	});

	chrome.omnibox.onInputChanged.addListener(function(input, suggest) {
		var services = getSuggestions(input);
		var suggestions = services.map(function(service) {
			return {
				content: service.name,
				description: 'Terminal for Google : ' +
					chrome.i18n.getMessage('access_to', [service.name])
			};
		});

		suggest(suggestions);
	});

	function getSuggestions(input) {
		input = input.replace(IGNORE_REGEXP, '').toLowerCase();

		return services.map(function(service) {
			return {service: service, priority: service.suggest(input)};
		}).filter(function(result) {
			return result.priority !== -1;
		}).sort(function(a, b) {
			return a.priority - b.priority;
		}).map(function(result) {
			return result.service;
		});
	}
}();
