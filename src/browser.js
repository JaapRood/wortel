const DomReady = require('domready');
const Invariant = require('invariant');
const React = require('react');
const ReactDOM = require('react-dom');

const App = require('app');
const AppComponent = require('app/components/app')
const BaseStyles = require('app/styles/base.less')

const app = App();

const appEl = document.getElementById('app');

let render = () => {
	// Require the app here so that on every render we're sure to make the latest version of the 
	// App component. This will enable us to do hot module reloading.
	const AppComponent = require('app/components/app');

	ReactDOM.render(
		<AppComponent store={app.store} />
	, appEl);
}


if (module.hot) { // when hot reloading is enabled
	const renderApp = render;
	const renderError = (error) => {
		const Redbox = require('redbox-react');

		ReactDOM.render(
			<Redbox error={error} />
		, appEl);
	}

	render = () => {
		try {
			renderApp()
		} catch (error) {
			renderError(error)
		}
	}

	// register for the app component and any of it's deeper dependencies

	module.hot.accept('app/components/app', () => {
		setTimeout(render);
	})
}

DomReady(render);