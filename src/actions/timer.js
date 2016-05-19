const CreateAction = require('app/lib/create-action')
const T = require('time-sugar')

const TimerReducer = require('app/reducers/timer')

exports.start = () => {
	const length = T(5).seconds().valueOf()

	return CreateAction(TimerReducer.START, { length: length })
}

exports.stop = () => {
	return CreateAction(TimerReducer.STOP, { time: Date.now() })
}