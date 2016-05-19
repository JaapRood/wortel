const Redux = require('redux')
const React = require('react')
const ReactRedux = require('react-redux')
const ReduxLogger = require('redux-logger')
const ReduxThunk = require('redux-thunk')
const Immutable = require('immutable');
const _ = require('lodash')

const AppReducer = require('./reducers/app')

const internals = {}

internals.middlewares = [
	ReduxThunk.default
]

if (process.env.NODE_ENV !== "production") {
	internals.middlewares.push(ReduxLogger({
		stateTransformer: state => state.toJSON(),
		actionTransformer: action => {
			if (Immutable.Iterable.isIterable(action.payload)) {
				action.payload = action.payload.toJSON()
			}

			return action;
		}
	}))
}

module.exports = function(initialState) {
	const store = Redux.createStore(AppReducer, Redux.applyMiddleware(...internals.middlewares))

	if (module.hot) { // when we have hot reloading enabled
		module.hot.accept('./reducers/app', () => {
			const nextAppReducer = require('./reducers/app')
			store.replaceReducer(nextAppReducer, Immutable.Map())
		})
	}

	return {
		store: store
	}
}