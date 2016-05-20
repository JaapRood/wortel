const { handleActions } = require('redux-actions')
const Immutable = require('immutable')
const ShortId = require('shortid')

exports.START = 'TIMER_START'
// exports.STOP = 'TIMER_STOP'
exports.PAUSE = 'TIMER_PAUSE'

const internals = {}

internals.startTimer = (timer, { payload }) => {
	return timer.merge({
		id: ShortId.generate(),
		startedAt: Date.now(),
		pausedAt: null,
		length: payload.length
	})
}

internals.pauseTimer = (timer, { payload }) => {
	return timer.set('pausedAt', payload.time)
}

internals.handleActions = handleActions({
	[exports.START]: internals.startTimer,
	[exports.PAUSE]: internals.pauseTimer
})

exports.reduce = (timer, action) => {
	if (!timer) {
		timer = Immutable.Map({
			id: ShortId.generate(),
			startedAt: null,
			pausedAt: null,
			length: null
		})
	}

	return internals.handleActions(timer, action)
}

exports.getFromState = (state) => state.get('timer')
