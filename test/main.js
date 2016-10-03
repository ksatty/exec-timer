'use strict';

process.env.NODE_ENV = 'test';

const expect = require('chai').expect;

const timer = require('../');

describe('Timer', () => {
	it('should measure a simple function', () => {
		function f (param1, param2) {
			return `f -> ${param1}+${param2}`;
		}

		let result = timer.measure('function f()', (end) => {
			end();
			return f('a', 'b');
		});

		expect(result).to.equal('f -> a+b');
		expect(timer.get('function f()')).to.be.above(0);
	});

	it('should measure a function with callback', (done) => {
		function cb (param1, param2, callback) {
			setTimeout(() => {
				callback(`cb -> ${param1}+${param2}`);
			}, 500);
		}

		timer.measure('function cb()', (end) => {
			cb('c', 'd', data => {
				end();

				try {
					expect(data).to.equal('cb -> c+d');
					expect(timer.get('function cb()')).to.be.above(0.500);
					done();
				} catch (e) {
					done(e);
				}
			});
		});
	});

	it('should measure a resolved promise', (done) => {
		timer.measure('promise resolved', new Promise((resolve, reject) => {
			setTimeout(() => {
				resolve('promise -> resolved');
			}, 200);
		})).then(data => {
			try {
				expect(data).to.equal('promise -> resolved');
				expect(timer.get('promise resolved')).to.be.above(0.200);
				done();
			} catch (error) {
				done(error);
			}
		}).catch(error => {
			done(error);
		});
	});

	it('should measure a rejected promise', (done) => {
		timer.measure('promise rejeted', new Promise((resolve, reject) => {
			setTimeout(() => {
				reject(new Error('promise -> rejeted'));
			}, 200);
		})).then(data => {
			done(new Error(JSON.stringify(data)));
		}).catch(error => {
			try {
				expect(error).to.be.an('error');
				expect(error.message).to.equal('promise -> rejeted');
				expect(timer.get('promise rejeted')).to.be.above(0.200);
				done();
			} catch (error) {
				done(error);
			}
		});
	});

	it('should get all the measurements', () => {
		timer.measure('measure 1', (end) => {
			end();
		});
		timer.measure('measure 2', (end) => {
			end();
		});

		let measurements = timer.get();

		expect(measurements.has('measure 1')).to.be.true;
		expect(measurements.has('measure 2')).to.be.true;

		let oMeasurements = measurements.toObject();

		expect(oMeasurements['measure 1']).to.be.above(0);
		expect(oMeasurements['measure 2']).to.be.above(0);
	});

	it('should get a single measurement', () => {
		timer.measure('measure 1', (end) => {
			end();
		});
		timer.measure('measure 2', (end) => {
			end();
		});

		expect(timer.get('measure 1')).to.be.above(0);
		expect(timer.get('measure 2')).to.be.above(0);
	});

	it('should clear a single measurement', () => {
		timer.measure('measure 1', (end) => {
			end();
		});
		timer.measure('measure 2', (end) => {
			end();
		});

		expect(timer.get('measure 1')).to.be.above(0);
		expect(timer.get('measure 2')).to.be.above(0);

		timer.reset('measure 1');

		expect(timer.get('measure 1')).to.be.undefined;
		expect(timer.get('measure 2')).to.be.above(0);
	});

	it('should clear all measurements', () => {
		timer.measure('measure 1', (end) => {
			end();
		});
		timer.measure('measure 2', (end) => {
			end();
		});

		expect(timer.get('measure 1')).to.be.above(0);
		expect(timer.get('measure 2')).to.be.above(0);

		timer.reset();

		expect(timer.get('measure 1')).to.be.undefined;
		expect(timer.get('measure 2')).to.be.undefined;
	});
});