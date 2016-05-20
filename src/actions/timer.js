const CreateAction = require('app/lib/create-action')
const T = require('time-sugar')

const TimerReducer = require('app/reducers/timer')

const internals = {}

// TODO: We probably shouldn't keep state here. Consider moving it elsewhere, like a service / middleware
internals.timer = null
internals.timerId = null

internals.resetTimer = () => {
	if (internals.timer) {
		clearTimeout(internals.timer)
		internals.timer = null
		internals.timerId = null
	}
}

internals.startTimer = () => (dispatch, getState) => {
	const timer = TimerReducer.getFromState(getState())

	const timeoutLength = timer.get('length') - (Date.now() - timer.get('startedAt'))
	internals.timerId = timer.get('id')
	internals.timer = setTimeout(() => {
		const currentTimerId = TimerReducer.getFromState(getState()).get('id')

		if (internals.timerId !== currentTimerId) return; // ignore, this timer no longer exists

		dispatch(exports.finish())
	}, timeoutLength)
}

exports.start = () => (dispatch, getState) => {
	const length = T(5).seconds().valueOf()

	internals.resetTimer()

	dispatch(CreateAction(TimerReducer.START, { length: length }))

	dispatch(internals.startTimer())
}

exports.pause = () => (dispatch, getState) => {
	internals.resetTimer()

	dispatch(CreateAction(TimerReducer.PAUSE, { time: Date.now() }))
}

exports.resume = () => (dispatch, getState) => {
	dispatch(CreateAction(TimerReducer.RESUME, { length: length }))
	
	dispatch(internals.startTimer())
}

exports.finish = () => (dispatch, getState) => {
	internals.resetTimer()

	dispatch(CreateAction(TimerReducer.FINISH, { time: Date.now() }))
}