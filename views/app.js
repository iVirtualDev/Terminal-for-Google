/*
 * (C) 2013 chick307 <chic307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function() {
	var app = angular.module('terminalForGoogle', []);

	app.factory('i18n', function() {
		return chrome.i18n.getMessage.bind(chrome.i18n);
	});
}();
