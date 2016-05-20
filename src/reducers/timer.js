const { handleActions } = require('redux-actions')
const Immutable = require('immutable')
const ShortId = require('shortid')

exports.START = 'TIMER_START'
exports.PAUSE = 'TIMER_PAUSE'
exports.RESUME = 'TIMER_RESUME'
exports.FINISH = 'TIMER_FINISH'

const internals = {}

internals.startTimer = (timer, { payload }) => {
	return timer.merge({
		id: ShortId.generate(),
		startedAt: Date.now(),
		pausedAt: null,
		finishedAt: null,
		length: payload.length
	})
}


internals.pauseTimer = (timer, { payload }) => {
	return timer.set('pausedAt', payload.time)
}

internals.resumeTimer = (timer, { payload }) => {
	const timePaused = Date.now() - timer.get('pausedAt')

	return timer.merge({
		pausedAt: null,
		length: timer.get('length') + timePaused
	})
}

internals.finishTimer = (timer, { payload }) => {
	return timer.set('finishedAt', payload.time)
}

internals.handleActions = handleActions({
	[exports.START]: internals.startTimer,
	[exports.PAUSE]: internals.pauseTimer,
	[exports.RESUME]: internals.resumeTimer,
	[exports.FINISH]: internals.finishTimer
})

exports.reduce = (timer, action) => {
	if (!timer) {
		timer = Immutable.Map({
			id: ShortId.generate(),
			startedAt: null,
			pausedAt: null,
			finishedAt: null,
			length: null
		})
	}

	return internals.handleActions(timer, action)
}

exports.getFromState = (state) => state.get('timer')
