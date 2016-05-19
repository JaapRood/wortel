const CreateAction = require('app/lib/create-action')
const T = require('time-sugar')

const TimerReducer = require('app/reducers/timer')

const internals = {}

// TODO: We probably shouldn't keep state here. Consider moving it elsewhere, like a service / middleware
internals.timer = null
internals.timerId = null

exports.start = () => (dispatch, getState) => {
	const length = T(5).seconds().valueOf()

	if (internals.timer) {
		clearTimeout(internals.timer)
		internals.timer = null
		internals.timerId = null
	}

	dispatch(CreateAction(TimerReducer.START, { length: length }))

	const createdTimer = TimerReducer.getFromState(getState())

	internals.timerId = createdTimer.get('id')
	internals.timer = setTimeout(() => {
		const currentTimerId = TimerReducer.getFromState(getState()).get('id')

		if (internals.timerId !== currentTimerId) return; // ignore, this timer no longer exists

		dispatch(exports.stop())
	}, length - (Date.now() - createdTimer.get('startedAt')))
}

exports.stop = () => {
	return CreateAction(TimerReducer.STOP, { time: Date.now() })
}