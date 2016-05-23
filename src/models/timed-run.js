const { State } = require('vry')
const Invariant = require('invariant')
const ShortId = require('shortid')

const TimedRun = State.create('tracked-time', {
	id: null,
	startedAt: null,
	stoppedAt: null
})

TimedRun.create = (startTime) => {
	Invariant(startTime instanceof Date, 'Valid start Date required when creating TimedRun')

	return TimedRun.factory({
		id: ShortId.generate(),
		startedAt: startTime.getTime()
	})
}

TimedRun.hasStopped = (time) => {
	Invariant(TimedRun.instanceOf(time), 'TimedRun required to assess whether tracked time has stopped')

	return !!time.get('stoppedAt')
}

TimedRun.stop = (time, stoppedAt) => {
	Invariant(TimedRun.instanceOf(time), 'TimedRun required to mark its ending')
	Invariant(!TimedRun.hasStopped(time), 'TimedRun cant be stopped once its already stopped')
	Invariant(stoppedAt instanceof Date, 'Stop time Date required to mark the endign of a TimedRun')

	return time.set('stoppedAt', stoppedAt.getTime())
}

TimedRun.getLength = (time) => {
	Invariant(
		TimedRun.instanceOf(time) && TimedRun.hasStopped(time)
	, 'TimedRun that has stopped required to get the length it ran for')

	return time.get('stoppedAt') - time.get('startedAt')
}

module.exports = TimedRun