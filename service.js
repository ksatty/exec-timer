'use strict';

const timer = require('./lib/timer');

timer.measure('service promise', new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('ok');
		// reject(new Error('no ok'));
	}, 200);
})).then(data => {
	console.log('Promisded service something', data);
}).catch(error => {
	console.error('Promised service error', error);
});