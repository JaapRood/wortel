const React = require('react');
const { Provider } = require('react-redux')

const Timer = require('./timer')

const Styles = require('app/styles/components/app.less');

const App = ({ store }) => {
	return (
		<Provider store={store}>
			<div className={Styles.container}>
				<h2>Wortel</h2>

				<Timer />
			</div>
		</Provider>
	)
}

module.exports = App