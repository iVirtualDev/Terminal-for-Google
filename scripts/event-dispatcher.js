/*
 * (C) 2012-2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function(global, definition) {
	if (typeof exports === 'object') {
		// CommonJS
		module.exports = definition();
	} else if (typeof define === 'function' && define.amd) {
		// RequireJS
		define(definition);
	} else {
		// Web browsers
		global.EventDispatcher = definition();
	}
}(this, function() {
	var EventDispatcher = (function() {
		var ctor = function EventDispatcher(owner, port) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot be called as a function.');
			}

			this._owner = owner;
			this._listeners = [];
			this._port = port;

			if (!port.onmessage)
				port.onmessage = function() {};
			port.addEventListener('message', this, false);
		};

		var proto = ctor.prototype;

		proto.handleEvent = function handleEvent(event) {
			var owner = this._owner, data = event.data;
			this._listeners.forEach(function(listener){
				listener.call(owner, data);
			});
		};

		proto.addListener = function(listener){
			this._listeners.push(listener);
			return listener;
		};

		proto.removeListener = function(listener){
			var index = this._listeners.indexOf(listener);
			if (index !== -1)
				return this._listeners.splice(index, 1)[0];
			return null;
		};

		proto.hasListener = function hasListener(listener) {
			var index = this._listeners.indexOf(listener);
			return index !== -1;
		};

		return ctor;
	}());

	return EventDispatcher;
});
