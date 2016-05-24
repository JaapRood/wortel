const ReduxImmutable = require('redux-immutable')

const combinedReducers = ReduxImmutable.combineReducers({
	sprint: require('./sprint').reduce
})

module.exports = combinedReducers;