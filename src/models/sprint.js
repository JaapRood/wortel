const { State } = require('vry')
const Immutable = require('immutable')
const Invariant = require('invariant')
const _ = require('lodash')

const TimedRun = require('./timed-run')

const Sprint = State.create('sprint', {
	startedAt: null,
	finishedAt: null,
	length: null,
	timedRuns: Immutable.List()
})

Sprint.create = (startTime, length) => {
	Invariant(startTime instanceof Date, 'Start time Date required to create a sprint')
	Invariant(_.isNumber(length) && length > 0, 'Length of sprint in milliseconds required to create a sprint')

	return Sprint.factory({
		startedAt: startTime.getTime(),
		length: length,
		timedRuns: Immutable.List([
			TimedRun.create(startTime)
		])
	})
}

Sprint.getCompletedLength = (sprint) => {
	Invariant(Sprint.instanceOf(sprint), 'Sprint is required to get its the length so far completed')

	const completedRuns = sprint.get('timedRuns').filter(TimedRun.hasStopped)

	return completedRuns.reduce((runTime, run) => runTime + TimedRun.getLength(run), 0)
}

Sprint.getRemainingLengthAt = (sprint, time) => {
	Invariant(Sprint.instanceOf(sprint), 'Sprint is required to get the remaining length at a given time')
	Invariant(time instanceof Date, 'Date is required to measure the remaining length at that time')

	time = time.getTime()

	return sprint.get('timedRuns').reduce((timeLeft, run) => {
		if (timeLeft <= 0) return timeLeft

		const startedAt = run.get('startedAt')
		const stoppedAt = run.get('stoppedAt')

		if (!startedAt || startedAt > time) {
			return timeLeft
		} else if (stoppedAt && stoppedAt < time) {
			return timeLeft - (stoppedAt - startedAt)
		} else {
			return timeLeft - (time - startedAt)
		}
	}, sprint.get('length'))
}

Sprint.getCurrentRun = (sprint) => {
	Invariant(Sprint.instanceOf(sprint), 'Sprint is required to get the current run')

	return sprint.get('timedRuns').last()
}

Sprint.isStarted = (sprint) => {
	Invariant(Sprint.instanceOf(sprint), 'Sprint is required to assess whether it is started')

	return !!sprint.get('startedAt') && TimedRun.instanceOf(sprint.get('timedRuns').last())
}

Sprint.isRunning = (sprint) => {
	Invariant(Sprint.instanceOf(sprint), 'Sprint is required to assess whether it is running')

	const lastRun = sprint.get('timedRuns').last()

	return Sprint.isStarted(sprint) && !TimedRun.hasStopped(lastRun)
}

Sprint.hasCompletedLength = (sprint) => {
	Invariant(Sprint.instanceOf(sprint), 'Sprint is required to assess whether it has completed its length')

	const completedLength = Sprint.getCompletedLength(sprint)

	return completedLength >= sprint.get('length')
}

Sprint.isFinished = (sprint) => {
	Invariant(Sprint.instanceOf(sprint), 'Sprint is required to assess whether it has finished')

	return Sprint.isStarted(sprint) && !Sprint.isRunning(sprint) && Sprint.hasCompletedLength(sprint)
}

Sprint.isPaused = (sprint) => {
	Invariant(Sprint.instanceOf(sprint), 'Sprint is required to assess whether it is paused')

	return Sprint.isStarted(sprint) && !Sprint.isRunning(sprint) && !Sprint.hasCompletedLength(sprint)
}

Sprint.start = (sprint, time) => {
	Invariant(
		Sprint.instanceOf(sprint) && Sprint.isPaused(sprint)
	, 'Sprint is required to start a sprint')
	Invariant(time instanceof Date, 'Time required at which to start')

	const lastRun = sprint.get('timedRuns').last()

	Invariant(time.getTime() > lastRun.get('stoppedAt'), 'Time at to which start Sprint must be after it was last paused')

	return sprint.update('timedRuns', runs => runs.push(TimedRun.create(time)))
}

Sprint.stop = (sprint, stoppedAt) => {
	Invariant(
		Sprint.instanceOf(sprint) && Sprint.isRunning(sprint)
	, 'Running Sprint is required to stop it')
	Invariant(stoppedAt instanceof Date, 'Stop time Date required to stop a sprint')

	const lastRunIndex = sprint.get('timedRuns').count() - 1;
	const updatedSprint = sprint.updateIn(['timedRuns', lastRunIndex], (run) => {
		return TimedRun.stop(run, stoppedAt)
	})

	if (Sprint.isFinished(updatedSprint)) {
		return updatedSprint.set('finishedAt', stoppedAt.getTime())
	} else {
		return updatedSprint;
	}
}

module.exports = Sprint