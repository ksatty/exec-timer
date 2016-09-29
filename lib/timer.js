'use strict';

const 	mt = require('microtime');

let measurements = new Map();

measurements.toObject = function () {
	let o = {};
	for (let entry of this.entries()) {
		o[entry[0]] = entry[1];
	}

	return o;
};

function measure(label, what) {
	let start = mt.nowDouble();

	if (what instanceof Promise) {
		what
			.then(function() {
				let end = mt.nowDouble();

				measurements.set(label, end - start);

				return Promise.resolve.apply(this, arguments);
			})
			.catch(function() {
				let end = mt.nowDouble();

				measurements.set(label, end - start);

				return Promise.reject.apply(this, arguments);
			});

		return what;
	} else {
		let result = what(() => {
			let end = mt.nowDouble();

			measurements.set(label, end - start);			
		});

		return result;
	}
}

function get(label) {
	if (label) {
		return measurements.get(label);
	} else {
		return measurements;
	}
}

module.exports = {
	'measure': measure,
	'get': get
};