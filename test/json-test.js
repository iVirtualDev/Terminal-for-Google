/*
 * (C) 2013 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

var assert = require('assert');
var manifest = require('../manifest');
var package = require('../package');

describe('manifest.json', function() {
	describe('manifest.version', function() {
		it('should be same as package.version', function() {
			assert.strictEqual(manifest.version, package.version);
		});
	});
});
