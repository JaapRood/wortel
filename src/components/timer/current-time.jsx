const React = require('react')
const Raf = require('raf')

const internals = {}

internals.getElapsedSeconds = (startTime) => {
	return Math.floor((Date.now() - startTime) / 1000)
}

internals.getSecondsLeft = (endTime) => {
	return Math.ceil((endTime - Date.now()) / 1000)
}

module.exports = React.createClass({
	getDefaultProps() {
		return {
			startedAt: null,
			endsAt: null
		}
	},

	getInitialState() {
		return {
			seconds: internals.getElapsedSeconds(this.props.startedAt)
		}
	},

	render() {
		const { 
			seconds
		} = this.state

		return (
			<h3>{seconds} seconds</h3>
		)
	},

	// Lifecycle
	// ---------

	componentDidMount() {
		this.raf = Raf(this.tick)
	},

	componentWillUnmount() {
		if (this.raf) {
			Raf.cancel(this.raf)
			this.raf = null
		}
	},

	tick() {
		if (!this.isMounted()) return

		this.updateTime(() => {
			this.raf = Raf(this.tick)
		})
	},

	// State control
	// -------------

	updateTime(callback) {
		if (this.props.startedAt) {
			let elapsedSeconds = internals.getElapsedSeconds(this.props.startedAt)
			
			if (elapsedSeconds !== this.state.seconds) {
				return this.setState({
					seconds: elapsedSeconds
				}, callback)
			}
		} else if (this.props.endsAt) {
			let secondsLeft = internals.getSecondsLeft(this.props.endsAt)

			if (secondsLeft !== this.state.seconds) {
				return this.setState({
					seconds: secondsLeft
				}, callback)
			}
		}

		callback()
	}
})