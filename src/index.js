const Redux = require('redux')
const React = require('react')
const ReactRedux = require('react-redux')
const ReduxLogger = require('redux-logger')
const _ = require('lodash')

const AppReducer = require('./reducers/app')

const internals = {}

internals.middlewares = []

if (process.env.NODE_ENV !== "production") {
	internals.middlewares.push(ReduxLogger())
}

module.exports = function() {
	const store = Redux.createStore(AppReducer, Redux.applyMiddleware(...internals.middlewares))

	if (module.hot) { // when we have hot reloading enabled
		module.hot.accept('./reducers/app', () => {
			const nextAppReducer = require('./reducers/app')
			store.replaceReducer(nextAppReducer)
		})
	}

	return {
		store: store
	}
}