'use strict';

let measurements = new Map();

measurements.toObject = function () {
	let o = {};
	for (let entry of this.entries()) {
		o[entry[0]] = entry[1];
	}

	return o;
};
Object.defineProperty(measurements, 'toObject', {
	enumerable: false
});

let starts = new Map();

function start(label) {
	starts.set(label, process.hrtime());
}

function end(label) {
	let start = starts.get(label);
	if (start !== undefined) {
		let diff = process.hrtime(start);

		measurements.set(label, diff[0] + (diff[1] / 1e9));
		starts.delete(label);
	}
}

function measure(label, what) {
	start(label);

	if (what instanceof Promise || (typeof what.then == 'function' && typeof what.catch == 'function')) {
		what
			.then(function(data) {
				end(label);

				return Promise.resolve(data);
			})
			.catch(function(error) {
				end(label);

				return Promise.reject(error);
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

function reset(label) {
	if (label) {
		measurements.delete(label);
	} else {
		measurements.clear();
	}
}

module.exports = {
	'measure': measure,
	'get': get,
	'start': start,
	'end': end,
	'reset': reset
};