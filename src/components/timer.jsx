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
		finishedAt,
		length
	} = props

	const isRunning = startedAt && !pausedAt && !finishedAt
	const isPaused = startedAt && pausedAt
	const hasFinished = startedAt && finishedAt

	const onClickStart = (e) => {
		e.preventDefault()

		props.onStart()
	}

	const onClickPause = (e) => {
		e.preventDefault()

		props.onPause()
	}

	const onClickResume = (e) => {
		e.preventDefault()

		props.onResume()
	}

	return (
		<div>
			{ isRunning && (
				<div>
					Running for {Math.round(length / 1000)} seconds, Started at: {startedAt}

					<CurrentTime endsAt={startedAt + length} />
				</div>
			)}

			{ isPaused && (
				<div>
					Paused with {Math.round((pausedAt - startedAt) / 1000)}, paused at: {pausedAt}
				</div>
			)}

			{ hasFinished && (
				<div>
					Ran for { (finishedAt - startedAt)  / 1000 } seconds, Finished at: {finishedAt}
				</div>
			)}

			{ (!isRunning && !isPaused) || hasFinished ? (
				<button onClick={onClickStart}>Start</button>
			) : isPaused ? (
				<button onClick={onClickResume}>Resume</button>
			):(
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
		finishedAt: timer.get('finishedAt'),
		length: timer.get('length')
	}
}

internals.actionProps = {
	onStart: TimerActions.start,
	onPause: TimerActions.pause,
	onResume: TimerActions.resume
}

module.exports = connect(internals.getPropsFromState, internals.actionProps)(internals.component)