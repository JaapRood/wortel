const ReduxImmutable = require('redux-immutable')

const combinedReducers = ReduxImmutable.combineReducers({
	sprint: require('./sprint').reduce,
	timer: require('./timer').reduce
})

module.exports = combinedReducers;