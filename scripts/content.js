// Function to get link title from link url.
var resolveLink = (function(){
	var links = {};

	document.addEventListener('contextmenu', function(event){
		if(event.target.tagName.toLowerCase() === 'a')
			links[event.target.href] = event.target.textContent;
	}, false);

	return function(url){
		if(Object.prototype.hasOwnProperty.call(links, url))
			return links[url];

		alert('Failed to get link title', 'Terminal for Google');

		return '';
	};
})();


function encodeObject(map){
	return Object.keys(map).map(function(key){
		var value = map[key];
		return key + '=' + encodeURIComponent(value)
	}).join('&');
}


function sendTextFromGmail(title, text){
	var url = 'https://mail.google.com/mail/?' + encodeObject({
		view: 'cm',
		fs: 1,
		tf: 1,
		su: title,
		body: text
	});

	window.open(url);
}


function sendLinkFromGmail(link){
	var url = 'https://mail.google.com/mail/?' + encodeObject({
		view: 'cm',
		fs: 1,
		tf: 1,
		su: resolveLink(link),
		body: link
	});

	window.open(url);
}


function sendPageFromGmail(title, page){
	var url = 'https://mail.google.com/mail/?' + encodeObject({
		view: 'cm',
		fs: 1,
		tf: 1,
		su: title,
		body: page
	});

	window.open(url);
}


function blogThisText(title, text, page){
	var url = 'http://www.blogger.com/blog-this.g?' + encodeObject({
		t: text,
		u: page,
		n: title
	});

	window.open(url);
}


function blogThisLink(link){
	var url = 'http://www.blogger.com/blog-this.g?' + encodeObject({
		t: '',
		u: link,
		n: resolveLink(link)
	});

	window.open(url);
}


function blogThisPage(title, page){
	var url = 'http://www.blogger.com/blog-this.g?' + encodeObject({
		t: '',
		u: page,
		n: title
	});

	window.open(url);
}


// Receive requests.
chrome.extension.onRequest.addListener(function(req, sender, callback){
	var action = req.action;
	var info = req.info;
	var tab = req.tab;

	switch(req.action){
		case 'gmail':
			switch(false){
				case !info.linkUrl:
					sendLinkFromGmail(info.linkUrl);
					break;
				case !info.selectionText:
					sendTextFromGmail(tab.title || '', info.selectionText);
					break;
				case !info.pageUrl:
					sendPageFromGmail(tab.title || '', info.pageUrl);
					break;
				
			}
			break;
		case 'blogger':
			switch(false){
				case !info.linkUrl:
					blogThisLink(info.linkUrl);
					break;
				case !info.selectionText:
					blogThisText(
						tab.title || '', info.selectionText, info.pageUrl);
					break;
				case !info.pageUrl:
					blogThisPage(tab.title || '', info.pageUrl);
					break;
			}
			break;
	}
});
