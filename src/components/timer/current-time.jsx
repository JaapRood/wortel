const React = require('react')
const Raf = require('raf')

const internals = {}

internals.getElapsedSeconds = (startTime) => {
	return Math.floor((Date.now() - startTime) / 1000)
}

module.exports = React.createClass({
	getDefaultProps() {
		return {
			startedAt: null
		}
	},

	getInitialState() {
		return {
			elapsedSeconds: internals.getElapsedSeconds(this.props.startedAt)
		}
	},

	render() {
		const { 
			elapsedSeconds
		} = this.state

		return (
			<h3>{elapsedSeconds} seconds</h3>
		)
	},

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

		this.updateElapsed(() => {
			this.raf = Raf(this.tick)
		})
	},

	updateElapsed(callback) {
		const elapsedSeconds = internals.getElapsedSeconds(this.props.startedAt)

		if (elapsedSeconds !== this.state.elapsedSeconds) {
			this.setState({
				elapsedSeconds: elapsedSeconds
			}, callback)
		} else {
			callback()
		}
	}
})