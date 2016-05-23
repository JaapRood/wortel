const { handleActions } = require('redux-actions')
const T = require('time-sugar')

const Sprint = require('app/models/sprint')

exports.START = 'SPRINT_START'
exports.PAUSE = 'SPRINT_PAUSE'
exports.RESUME = 'SPRINT_RESUME'
exports.FINISH = 'SPRINT_FINISH'

const internals = {}

internals.start = (sprint, { payload }) => {
	return Sprint.create(payload.time, payload.length)
}

internals.stop = (sprint, { payload }) => {
	return Sprint.stop(sprint, payload.time)
}

internals.pause = internals.stop
internals.finish = internals.stop

internals.resume = (sprint, { payload }) => {
	return Sprint.start(sprint, payload.time)
}

internals.handleActions = handleActions({
	[exports.START]: internals.start,
	[exports.PAUSE]: internals.pause,
	[exports.RESUME]: internals.resume,
	[exports.FINISH]: internals.stop
})

exports.reduce = (sprint, action) => {
	if (!sprint) {
		sprint = Sprint.factory()
	}

	return internals.handleActions(sprint, action)
}

exports.getFromState = state => state.get('sprint')