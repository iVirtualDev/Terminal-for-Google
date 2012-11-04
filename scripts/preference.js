/*
 * Copyright (c) 2012 Chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT Licence.
 * http://opensource.org/licenses/MIT
 */

var Preference = (function() {
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var getItem = Storage.prototype.getItem;
	var setItem = Storage.prototype.setItem;
	var removeItem = Storage.prototype.removeItem;

	var ctor = function Preference(args) {
		if (!(this instanceof ctor))
			throw new TypeError('Constructor cannot');

		var channel = new MessageChannel();
		this._onChangePort = channel.port1;
		this.onChange = new EventDispatcher(this, channel.port2);

		if (args == null) {
			this._key = function _key(key) { return key };
			this._storage = localStorage;
		} else {
			var prefix = args.prefix || '', suffix = args.suffix || '';
			this._key = function _key(key) { return prefix + key + suffix };
			this._storage = args.storage || localStorage;
			if (args.defaultValues)
				this.update(args.defaultValues, false);
			if (args.onChange)
				this.onChange.addListener(args.onChange);
		}
	};

	var proto = ctor.prototype = {};
	proto.constructor = ctor;

	proto.get = function get(key, defaultValue) {
		if (!this.has(key)) {
			return defaultValue;
		} else {
			var value = getItem.call(this._storage, this._key(key));
			return JSON.parse(value);
		}
	};

	proto.set = function set(key, value) {
		setItem.call(this._storage, this._key(key), JSON.stringify(value));
		this._onChangePort.postMessage({key: key, value: value});
		return value;
	};

	proto.add = function add(key, value) {
		var v = this.get(key, void 0);
		if (v === void 0)
			return this.set(key, value);
		return v;
	};

	proto.update = function update(keyValues, overwrite) {
		if (overwrite == null)
			overwrite = true;

		var result = {};
		Object.keys(keyValues).forEach(overwrite ? function(key) {
			result[key] = this.set(key, keyValues[key]);
		}: function(key) {
			result[key] = this.add(key, keyValues[key]);
		}, this);
		return result;
	};

	proto.has = function has(key) {
		return hasOwnProperty.call(this._storage, this._key(key));
	};

	proto.remove = function remove(key) {
		if (!this.has(key))
			return false;
		removeItem.call(this._storage, this._key(key));
		return true;
	};

	return ctor;
}());
