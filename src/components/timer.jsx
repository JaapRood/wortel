const React = require('react');
const { connect } = require('react-redux');

const TimerActions = require('app/actions/timer')
const TimerReducer = require('app/reducers/timer')

const CurrentTime = require('./timer/current-time')

const internals = {};

internals.component = (props) => {
	const {
		startedAt,
		pausedAt,
		length
	} = props

	const isRunning = startedAt && !pausedAt
	const hasFinished = startedAt && pausedAt

	const onClickStart = (e) => {
		e.preventDefault()

		props.onStart()
	}

	const onClickPause = (e) => {
		e.preventDefault()

		props.onStop()
	}

	return (
		<div>
			{ isRunning  && (
				<div>
					Running for {Math.round(length / 1000)} seconds, Started at: {startedAt}

					<CurrentTime endsAt={startedAt + length} />
				</div>
			)}

			{ hasFinished && (
				<div>
					Ran for { (stoppedAt - startedAt)  / 1000 } seconds, Stopped at: {stoppedAt}
				</div>
			)}

			{ !isRunning || hasFinished ? (
				<button onClick={onClickStart}>Start</button>
			) : (
				<button onClick={onClickPause}>Pause</button>
			)}
		</div>
	)
}

internals.component.displayName = 'Timer'

internals.getPropsFromState = (state) => {
	const timer = TimerReducer.getFromState(state)

	return {
		startedAt: timer.get('startedAt'),
		pausedAt: timer.get('pausedAt'),
		length: timer.get('length')
	}
}

internals.actionProps = {
	onStart: TimerActions.start,
	onPause: TimerActions.pause
}

module.exports = connect(internals.getPropsFromState, internals.actionProps)(internals.component)