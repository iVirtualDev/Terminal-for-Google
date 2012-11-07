/*
 * Copyright (c) 2012 Chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT Licence.
 * http://opensource.org/licenses/MIT
 */

var Badge = (function() {
	var min = Math.min;
	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var ctor = function Badge(args) {
		if (!(this instanceof ctor))
			throw new TypeError('Constructor cannot called as a function.');

		var channel = new MessageChannel();
		this._onChangePort = channel.port1;
		this.onChange = new EventDispatcher(this, channel.port2);

		this._values = {};
		if (args != null) {
			Object.keys(args.keys || {}).forEach(function(key) {
				this._values[key] = {color: args.keys[key].color, value: null};
			}, this);
		}

		if (args != null && args.onChange)
			this.onChange.addListener(args.onChange);
	};

	var proto = ctor.prototype = {};
	proto.constructor = ctor;

	proto.get = function get(key, defaultValue) {
		if (hasOwnProperty.call(this._values, key))
			return this._values[key].value;
		return defaultValue;
	};

	proto.set = function set(key, value) {
		if (value === 0 || value === '' || value === void 0)
			value = null;
		this._values[key].value = value;
		this._refresh();
		this._onChangePort.postMessage({key: key, value: value});
	};

	proto._refresh = function _refresh() {
		var values = Object.keys(this._values).filter(function(key) {
			var value = this._values[key].value;
			return value !== null;
		}, this).map(function(key) {
			return {
				color: this._values[key].color || [96, 96, 96],
				value: this._values[key].value
			};
		}, this);

		if (values.length === 0) {
			chrome.browserAction.setBadgeText({text: ''});
		} else if (values.length === 1) {
			chrome.browserAction.setBadgeText({
				text: '' + values[0].value
			});

			chrome.browserAction.setBadgeBackgroundColor({
				color: values[0].color.concat([255])
			});
		} else {
			chrome.browserAction.setBadgeText({
				text: values.every(function(value) {
					return value.value === 'ERR';
				}) ? 'ERR' : '!'
			});

			chrome.browserAction.setBadgeBackgroundColor({
				color: values.reduce(function(color, value) {
					for (var i = 0; i < 3; i++)
						color[i] = min(255, color[i] + value.color[i]);
					return color;
				}, [0, 0, 0, 255])
			});
		}
	};

	return ctor;
}());
