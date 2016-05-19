const React = require('react');
const { connect } = require('react-redux');

const TimerActions = require('app/actions/timer')
const TimerReducer = require('app/reducers/timer')


const internals = {};

internals.component = (props) => {
	const {
		startedAt,
		stoppedAt,
		length
	} = props

	const isRunning = startedAt && !stoppedAt
	const hasFinished = startedAt && stoppedAt

	const onClickStart = (e) => {
		e.preventDefault()

		props.onStart()
	}

	const onClickStop = (e) => {
		e.preventDefault()

		props.onStop()
	}

	return (
		<div>
			{ isRunning  && (
				<div>Running for {Math.round(length / 1000)} seconds, Started at: {startedAt}</div>
			)}

			{ hasFinished && (
				<div>
					Ran for { (stoppedAt - startedAt)  / 1000 } seconds, Stopped at: {stoppedAt}
				</div>
			)}

			{ !isRunning || hasFinished ? (
				<button onClick={onClickStart}>Start</button>
			) : (
				<button onClick={onClickStop}>Stop</button>
			)}
		</div>
	)
}

internals.component.displayName = 'Timer'

internals.getPropsFromState = (state) => {
	const timer = TimerReducer.getFromState(state)

	return {
		startedAt: timer.get('startedAt'),
		stoppedAt: timer.get('stoppedAt'),
		length: timer.get('length')
	}
}

internals.actionProps = {
	onStart: TimerActions.start,
	onStop: TimerActions.stop
}

module.exports = connect(internals.getPropsFromState, internals.actionProps)(internals.component)