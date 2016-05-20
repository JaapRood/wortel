const { handleActions } = require('redux-actions')
const Immutable = require('immutable')
const ShortId = require('shortid')

exports.START = 'TIMER_START'
exports.STOP = 'TIMER_STOP'

const internals = {}

internals.startTimer = (timer, { payload }) => {
	return timer.merge({
		id: ShortId.generate(),
		startedAt: Date.now(),
		stoppedAt: null,
		length: payload.length
	})
}

internals.stopTimer = (timer, { payload }) => {
	return timer.set('stoppedAt', payload.time)
}

internals.handleActions = handleActions({
	[exports.START]: internals.startTimer,
	[exports.STOP]: internals.stopTimer
})

exports.reduce = (timer, action) => {
	if (!timer) {
		timer = Immutable.Map({
			id: ShortId.generate(),
			startedAt: null,
			stoppedAt: null,
			length: null
		})
	}

	return internals.handleActions(timer, action)
}

exports.getFromState = (state) => state.get('timer')
