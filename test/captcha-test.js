var vows = require('vows'),
	assert = require('assert'),
	Uncaptcha = require('../index.js'),
	config = require('config');

var uncaptcha = new Uncaptcha({key: config.key, decaptcherKey: config.decaptcherKey});

exports.tests = vows.describe('Uncaptcha Tests').addBatch({
	'Decode': {
		topic: function () {
			var self = this;

			uncaptcha.decode().done(
				function (result) {
					self.callback(null, result);
				},
				function (error) {
					self.callback(error);
				}
			);
		},

		'is response correct': function (topic) {
			assert.isNotNull(topic.challenge);
			assert.isNotNull(topic.decoded);
			assert.isNotNull(topic.genTaskID);
		}
	},

	'Refund': {
		topic: function () {
			var self = this;

			uncaptcha.decode().done(
				function (result) {
					uncaptcha.refund(result.genTaskID).done(
						function (result) {
							self.callback(null, result);
						},
						function (error) {
							self.callback(error);
						}
					);
				},
				function (error) {
					self.callback(error);
				}
			);
		},

		'is response correct': function (topic) {
			assert.equal(topic, 'ok');
		}
	}
});