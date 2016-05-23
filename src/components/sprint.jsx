const React = require('react');
const { connect } = require('react-redux');

const Sprint = require('app/models/sprint')
const SprintActions = require('app/actions/sprint')
const SprintReducer = require('app/reducers/sprint')

const CurrentTime = require('./timer/current-time')

const internals = {};

internals.component = (props) => {
	const {
		startedAt,
		pausedAt,
		finishedAt,
		willFinishAt,

		isRunning,
		isPaused,
		isFinished,

		length,
		remainingLength,
		completedLength
	} = props

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

					<CurrentTime endsAt={willFinishAt} />
				</div>
			)}

			{ isPaused && (
				<div>
					Paused with {Math.ceil(remainingLength / 1000)} left, paused at: {pausedAt}
				</div>
			)}

			{ isFinished && (
				<div>
					Ran for { completedLength / 1000 } seconds, Finished at: {finishedAt}
				</div>
			)}

			{ (!isRunning && !isPaused) || isFinished ? (
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
	const sprint = SprintReducer.getFromState(state)
	const lastRun = sprint.get('timedRuns').last()

	const length = sprint.get('length')
	const lastTime = lastRun ? (lastRun.get('stoppedAt') || lastRun.get('startedAt')) : null
	const remainingLength = lastTime ? Sprint.getRemainingLengthAt(sprint, new Date(lastTime)) : length
	const completedLength = Sprint.getCompletedLength(sprint)

	return {
		startedAt: sprint.get('startedAt'),
		pausedAt: lastRun ? lastRun.get('stoppedAt') : null,
		finishedAt: sprint.get('finishedAt'),
		willFinishAt: lastRun ? (lastRun.get('startedAt') + remainingLength) : null,

		isRunning: Sprint.isRunning(sprint),
		isPaused: Sprint.isPaused(sprint),
		isFinished: Sprint.isFinished(sprint),

		length: length,
		remainingLength: remainingLength,
		completedLength: completedLength

	}
}

internals.actionProps = {
	onStart: SprintActions.start,
	onPause: SprintActions.pause,
	onResume: SprintActions.resume
}

module.exports = connect(internals.getPropsFromState, internals.actionProps)(internals.component)