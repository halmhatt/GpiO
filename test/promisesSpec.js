import 'core-js/shim';

import {expect} from 'chai';
import fs from 'fs';
import GpioPin from '../lib/gpio-promise';
import sinon from 'sinon';

describe('gpio-promise', function(){

	let writeFile;
	let readFile;

	beforeEach(() => {
		sinon.stub(fs, 'exists', () => {
			return true;
		});

		writeFile = sinon.stub(fs, 'writeFile').yields([null]);
		readFile = sinon.stub(fs, 'readFile', (file, encoding, fn) => {
			fn(null, '1');
		});
	});

	it('should be possible to create object', () => {
		let gpio7 = new GpioPin(7);

		expect(gpio7).to.exist;
	});

	it('should open an input', () => {
		let gpio7 = new GpioPin(7);

		expect(gpio7.direction).to.be.undefined();

		return gpio7.in()
			.then(function() {
				expect(gpio7.direction).to.exist();
				expect(gpio7.direction).to.equal('in');
			});
	});

	it('should open an output', () => {
		let gpio7 = new GpioPin(7);

		expect(gpio7.direction).to.be.undefined();

		return gpio7.out()
			.then(function() {
				expect(gpio7.direction).to.exist();
				expect(gpio7.direction).to.equal('out');
			});
	});

	it('should be possible to change direction', () => {
		let gpio7 = new GpioPin(7);

		expect(gpio7.direction).to.be.undefined();

		return gpio7.open('in')
			.then(() => {
				expect(gpio7.direction).to.equal('in');
				return gpio7.out();
			})
			.then(() => {
				expect(gpio7.direction).to.equal('out');
			});
	});

	it('should handle all events', () => {
		let gpio7 = new GpioPin(7);
		let cnt = {rising: 0, falling: 0, change: 0};
		let sum = 0;

		return gpio7.in()
			.then(() => {
				expect(gpio7.value).to.equal(0);
				return;
			})
			.then(() => {
				gpio7.on('rising-edge', (value) => {
					expect(value).to.equal(1);
					cnt.rising++;
				});

				gpio7.on('falling-edge', (value) => {
					expect(value).to.equal(0);
					cnt.falling++;
				});

				gpio7.on('change', (value) => {
					cnt.change++;
					sum += value;
				});

				gpio7.emit('change', 0);
				gpio7.emit('change', 1);
				gpio7.emit('change', 1);
				gpio7.emit('change', 0);
				gpio7.emit('change', 1);
				gpio7.emit('change', 0);
				gpio7.emit('change', 0);
			})
			.then(() => {
				expect(cnt.rising).to.equal(2);
				expect(cnt.falling).to.equal(2);
				expect(cnt.change).to.equal(7);
				expect(sum).to.equal(3);
			});
	});

	afterEach(() => {
		fs.exists.restore();
		fs.writeFile.restore();
		fs.readFile.restore();
	});
});