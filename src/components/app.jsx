const React = require('react');
const { Provider } = require('react-redux')

const Sprint = require('./sprint')

const Styles = require('app/styles/components/app.less');

const App = ({ store }) => {
	return (
		<Provider store={store}>
			<div className={Styles.container}>
				<h2>Wortel</h2>

				<Sprint />
			</div>
		</Provider>
	)
}

module.exports = App