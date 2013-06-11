/*
 * (C) 2012-2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

var Badge = (function() {
	var ctor = function Badge(keys) {
		if (!(this instanceof ctor))
			throw new TypeError('Constructor cannot be called as a function.');

		this._values = Object.create(null);
		this._colors = Object.create(null);

		Array.prototype.slice.call(keys).forEach(function(key) {
			this._values[key] = 0;
			this._colors[key] = [0, 0, 0];
		}, this);
	};

	var proto = ctor.prototype;

	proto.get = function get(key) {
		key += '';

		return (key in this._values) ? this._values[key] : null;
	};

	proto.set = function set(key, value) {
		key += '';
		value |= 0;

		if (key in this._values && this._values[key] !== value) {
			this._values[key] = value;
			this._refresh();
		}
	};

	proto.getColor = function getColor(key) {
		key += '';

		return (key in this._colors) ? this._colors[key] : null;
	};

	proto.setColor = function setColor(key, value) {
		key += '';
		if (value == null || typeof value !== 'object')
			return;

		var color = this._colors[key];
		var r = value[0] & 0xFF, g = value[1] & 0xFF, b = value[2] & 0xFF;
		if (color && (color[0] !== r || color[1] !== g || color[2] !== b)) {
			this._colors[key] = [r, g, b];
			this._refresh();
		}
	};

	proto._refresh = function _refresh() {
		var values = [], colors = [];
		for (var key in this._values) {
			if (this._values[key] !== 0) {
				values.push(this._values[key]);
				colors.push(this._colors[key]);
			}
		}

		var text, color = [0, 0, 0, 255];
		if (values.length === 0) {
			text = '';
		} else if (values.length === 1) {
			text = (values[0] === -1) ? 'ERR' : '' + values[0];
			color = colors[0].concat([255]);
		} else {
			text = values.every(function(value) {
				return value === -1;
			}) ? 'ERR' : '!';
			color = colors.reduce(function(color, c) {
				for (var i = 0; i < 3; i++)
					color[i] = Math.min(255, color[i] + c[i]);
				return color;
			}, [0, 0, 0, 255]);
		}

		chrome.browserAction.setBadgeText({text: text});
		chrome.browserAction.setBadgeBackgroundColor({color: color});
	};

	return ctor;
}());
