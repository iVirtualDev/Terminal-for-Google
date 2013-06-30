/*
 * (C) 2012-2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

var assert = require('assert');

describe('eventDispatcher', function() {
	var eventDispatcher, owner, port;

	beforeEach(function() {
		var EventDispatcher = require('../scripts/event-dispatcher.js');
		eventDispatcher = new EventDispatcher(owner = {}, port = {
			_listeners: Object.create(null),
			_postMessage: function postMessage(data) {
				process.nextTick(function() {
					this._dispatchEvent({type: 'message', data: data});
				}.bind(this));
			},
			_dispatchEvent: function dispatchEvent(event) {
				if (!(event.type in this._listeners))
					return;
				var listeners = this._listeners[event.type];
				listeners.forEach(function(listener) {
					if (typeof listener === 'function') {
						listener.call(this, event);
					} else {
						listener.handleEvent(event);
					}
				}, this);
			},
			addEventListener: function addEventListener(type, listener) {
				if (!(type in this._listeners))
					this._listeners[type] = [];
				var listeners = this._listeners[type];
				listeners.push(listener);
				return listener;
			}
		});
	});

	it('.addListener(listener) => listener', function(done) {
		var data = {};
		var listener = function(d) {
			assert.strictEqual(this, owner);
			assert.strictEqual(d, data);
			done();
		};
		var l = eventDispatcher.addListener(listener);
		assert.strictEqual(l, listener);
		port._postMessage(data);
	});

	it('.hasListener(listener) => true', function() {
		var listener = function(d) {};
		eventDispatcher.addListener(listener);
		assert.strictEqual(eventDispatcher.hasListener(listener), true);
	});

	it('.hasListener(listener) => false', function() {
		var listener = function(d) {};
		assert.strictEqual(eventDispatcher.hasListener(listener), false);
	});

	it('.removeListener(listener) => listener', function(done) {
		var listener = function(d) {
			assert.fail(true);
		};
		eventDispatcher.addListener(listener);
		assert.strictEqual(eventDispatcher.hasListener(listener), true);
		var l = eventDispatcher.removeListener(listener);
		assert.strictEqual(l, listener);
		assert.strictEqual(eventDispatcher.hasListener(listener), false);
		eventDispatcher.addListener(function() {
			done();
		});
		port._postMessage({});
	});

	it('.removeListener(listener) => null', function() {
		var listener = function(d) {};
		var l = eventDispatcher.removeListener(listener);
		assert.strictEqual(l, null);
	});
});
