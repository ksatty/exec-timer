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

let starts = new Map();

function start(label) {
	starts.set(label, mt.nowDouble());
}

function end(label) {
	let start = starts.get(label);
	if (start !== undefined) {
		let end = mt.nowDouble();

		measurements.set(label, end - start);
		starts.delete(label);
	}
}

function measure(label, what) {
	start(label);

	if (what instanceof Promise) {
		what
			.then(function() {
				end(label);

				return Promise.resolve.apply(this, arguments);
			})
			.catch(function() {
				end(label);

				return Promise.reject.apply(this, arguments);
			});

		return what;
	} else {
		let result = what(() => {
			end(label);
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
	'get': get,
	'start': start,
	'end': end
};