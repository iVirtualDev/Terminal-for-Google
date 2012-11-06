/*
 * Copyright (c) 2012 Chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT Licence.
 * http://opensource.org/licenses/MIT
 */

void function() {
	if (document.documentElement.hasAttribute('x-terminal-for-google'))
		return;

	document.documentElement.setAttribute('x-terminal-for-google', '');

	var GMAIL_URL = 'https://mail.google.com/mail/?view=cm&fs=1&tf=1&';
	var BLOGGER_URL = 'http://www.blogger.com/blog-this.g?';

	// Retrieve the link text from the url.
	var linkText = (function(){
		var links = {};
		document.addEventListener('contextmenu', function(event) {
			var target = event.target;
			if(target.tagName.toLowerCase() === 'a')
				links[target.href] = target.textContent;
		}, false);
		return function linkText(url) {
			if(Object.prototype.hasOwnProperty.call(links, url))
				return links[url];
			alert('Failed to get link title', 'Terminal for Google');
			return '';
		};
	})();

	function encodeMap(map) {
		return Object.keys(map).map(function(key) {
			return key + '=' + encodeURIComponent(map[key]);
		}).join('&');
	}

	function mail(subject, body) {
		window.open(GMAIL_URL + encodeMap({su: subject, body: body}));
	}

	function blog(url, title, text) {
		window.open(BLOGGER_URL + encodeMap({t: text, u: url, n: title}));
	}

	chrome.extension.onRequest.addListener(onRequest);
	function onRequest(request, _a, _b) {
		void function(map) {
			map[request.id](
				document.title, location.href, request.text, request.link);
		}({
			'mail-page': function(title, url) { mail(title, url) },
			'mail-text': function(title, _, text) { mail(title, text) },
			'mail-link': function(_c, _d, _e, u) { mail(linkText(u), u) },
			'blog-page': function(title, url) { blog(url, title, '') },
			'blog-text': function(title, url, text) { blog(url, title, text) },
			'blog-link': function(_c, _d, _e, u) { blog(u, linkText(u), '') }
		});
	}
}();
