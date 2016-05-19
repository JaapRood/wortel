const Invariant = require('invariant');
const _ = require('lodash');

module.exports = function(type, payload, meta) {
	Invariant(_.isString(type) && type, 'Type is required to create a standard action');
	Invariant(!meta || _.isObject(meta), 'Metadata for action must be an object when used');

	return {
		type: type,
		payload: payload,
		error: payload instanceof Error,
		meta: meta || {}
	};
}