const Test = require('tape')
const Immutable = require('immutable')
const T = require('time-sugar')
const _ = require('lodash')

const TimedRun = require('app/models/timed-run')

Test('TimedRun.factory', (t) => {
	t.plan(6)

	t.doesNotThrow(function() {
		const timedRun = TimedRun.factory()

		t.ok(Immutable.Map.isMap(timedRun), 'returns an immutable')
		t.ok(TimedRun.instanceOf(timedRun), 'returned map is a TimedRun instance')
		t.equal(timedRun.get('id'), null, 'returned instance has id prop, which is null by default')
		t.equal(timedRun.get('startedAt'), null, 'returned instance has startedAt prop, which is null by default')
		t.equal(timedRun.get('stoppedAt'), null, 'returned instance has stoppedAt prop, which is null by default')
	}, 'accepts passing no arguments')
})

Test('TimedRun.create', (t) => {
	t.plan(4)

	const startDate = new Date()

	t.doesNotThrow(function() {
		const timedRun = TimedRun.create(startDate)

		t.ok(TimedRun.instanceOf(timedRun), 'returns a TimedRun instance')
		t.ok(timedRun.get('id') && _.isString(timedRun.get('id')), 'returned instance has a generated id')
		t.equal(timedRun.get('startedAt'), startDate.getTime(), 'returned instance has startedAt prop set to timestamp of date passed')
	}, 'accepts a start date')
})

Test('TimedRun.hasStopped', (t) => {
	t.plan(3)

	const startDate = new Date(T(15).minutes().beforeNow())
	const stopDate = new Date()
	const timedRun = TimedRun.create(startDate)

	t.doesNotThrow(function() {
		const stoppedRun = TimedRun.stop(timedRun, stopDate)

		t.ok(TimedRun.instanceOf(stoppedRun), 'returns an updated timed run instance')
		t.equal(stoppedRun.get('stoppedAt'), stopDate.getTime(), 'returned instance has stoppedAt prop set to timestamp of date passed')
	}, 'accepts a timed run instance and stop date')
})