const CreateAction = require('app/lib/create-action')
const T = require('time-sugar')

const Sprint = require('app/models/sprint')
const SprintReducer = require('app/reducers/sprint')

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
	const sprint = SprintReducer.getFromState(getState())
	
	const remainingLength = Sprint.getRemainingLengthAt(sprint, new Date())

	internals.timerId = Sprint.getCurrentRun(sprint).get('id')
	internals.timer = setTimeout(() => {
		const currentSprint = SprintReducer.getFromState(getState())
		const currentTimerId = Sprint.getCurrentRun(currentSprint).get('id')

		if (internals.timerId !== currentTimerId) return; // ignore, this timer no longer exists

		dispatch(exports.finish())
	}, remainingLength)
}

exports.start = () => (dispatch, getState) => {
	internals.resetTimer()

	dispatch(CreateAction(SprintReducer.START, { 
		time: new Date(),
		length: T(15).seconds().valueOf()
	}))

	dispatch(internals.startTimer())
}

exports.pause = () => (dispatch, getState) => {
	internals.resetTimer()

	dispatch(CreateAction(SprintReducer.PAUSE, { time: new Date() }))
}

exports.resume = () => (dispatch, getState) => {
	dispatch(CreateAction(SprintReducer.RESUME, { time: new Date(), length: length }))
	
	dispatch(internals.startTimer())
}

exports.finish = () => (dispatch, getState) => {
	internals.resetTimer()

	dispatch(CreateAction(SprintReducer.FINISH, { time: new Date() }))
}