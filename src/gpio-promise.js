// Shim
import 'core-js/shim';

import {GPIO} from './gpio';
import {EventEmitter} from 'events';
import _ from 'lodash';

const GPIO_PATH = '/sys/class/gpio/';

class GpioPin extends GPIO {
	constructor(headerNum, opts) {

		super(headerNum, opts);

		// let {interval} = opts;

		// if(typeof interval !== 'number') {
		// 	interval = 100;
		// }

		// this.interval = interval;

		// this.headerNum = headerNum;
		// this.value = 0;

		// this.PATH = {};
		// this.PATH.PIN =       `${gpiopath}gpio${headerNum}/`;
		// this.PATH.VALUE =     `${this.PATH.PIN}value`;
		// this.PATH.DIRECTION = `${this.PATH.PIN}direction`;
	}

	// Open in for input/output
	open(direction) {
		if(direction === 'in') {
			return this.in();
		} else {
			return this.out();
		}
	}

	// Set as input
	in() {
		return new Promise((resolve) => {
			this.setDirection('in', resolve);
		});
	}

	out() {
		return new Promise((resolve) => {
			this.setDirection('out', resolve);
		});
	}

	set(value) {
		return new Promise((resolve) => {
			this.set(value, resolve);
		});
	}

	// Set high
	high() {
		return this.set(1);
	}

	// Set low
	low() {
		return this.set(0);
	}

	// Toggle value between 1 and 0
	toggle() {
		return this.set(1 - this.value);
	}

	// Make it possible to use then
	ready(callback) {
		this.readyCallback = callback;
	}

	then() {
		this.ready.call(arguments);
	}

	// Listen for event
	on(event, callback) {
		let lastValue = this.value;

		if(event === 'rising-edge') {
			super.on('change', (value) => {
				if(value === 1 && lastValue === 0) {
					callback.call(this, value);
				}

				lastValue = value;
			});
			return;
		} else if(event === 'falling-edge') {
			super.on('change', (value) => {
				if(value === 0 && lastValue === 1) {
					callback.call(this, value);
				}

				lastValue = value;
			});
			return;
		}

		super.on(event, callback);
	}

	static unexport() {
		gpio.unexport.call(arguments);
	}

	static input(pinNumber) {
		return new GpioPin(pinNumber, 'in');
	}

	static output(pinNumber) {
		return new GpioPin(pinNumber, 'out');
	}
}

export default GpioPin;