'use strict';

module.exports = function(a, operator, b, opts) {
	var bool = false;
	switch (operator) {
		case '===':
			bool = a === b;
			break;
		case '>':
			bool = a > b;
			break;
		case '<':
			bool = a < b;
			break;
		default:
			// eslint-disable-next-line no-throw-literal
			throw 'Unknown operator ' + operator;
	}
	if (bool) {
		return opts.fn(this);
	} else {
		return opts.inverse(this);
	}
};
