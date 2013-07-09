var Requester = require('requester'),
	Decaptcher = require('decaptcher'),
	PromiseObject = require('promise-object');

var requester = new Requester();

var Uncaptcha = PromiseObject.create({
	initialize: function ($config) {
		this._decaptcher = new Decaptcher({key: $config.decaptcherKey});
		this._key = $config.key;
	},

	_getChallenge: function ($deferred, $self) {
		requester.get(
			'https://www.google.com/recaptcha/api/challenge?k=' + $self._key + '&ajax=1&cachestop=' + Math.random() + '&lang=en',
			{
				proxy: false,
				timeout: 120000
			},
			function (data) {
				var challenge = data.match(/challenge \: '([^']+)'/i);

				if (challenge) {
					$deferred.resolve(challenge[1]);
				} else {
					$deferred.reject(new Error('Recaptcha Error: (could not find challenge)'));
				}
			}
		);
	},

	_attemptChallenge: function ($deferred, challenge) {
		this._decaptcher.submitCaptcha('https://www.google.com/recaptcha/api/image?c=' + challenge, function (decoded, genTaskID) {
			$deferred.resolve({challenge: challenge, decoded: decoded, genTaskID: genTaskID});
		});
	},

	decode: function ($deferred, challenge) {
		if (challenge) {
			this._attemptChallenge(challenge)
				.done($deferred.resolve, $deferred.reject);
		} else {
			this._getChallenge()
				.then(this._attemptChallenge)
				.done($deferred.resolve, $deferred.reject);
		}
	},

	refund: function ($deferred, genTaskID) {
		this._decaptcher.getRefund(genTaskID, function (result) {
			if (result === 'ok') {
				$deferred.resolve(result);
			} else {
				$deferred.reject(new Error('Refund Error: (' + result + ')'));
			}
		});
	}
});

module.exports = exports = Uncaptcha;