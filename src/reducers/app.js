const ReduxImmutable = require('redux-immutable')

const combinedReducers = ReduxImmutable.combineReducers({
	timer: require('./timer').reduce
})

module.exports = combinedReducers;