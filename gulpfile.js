const Gulp = require('gulp');
const Gutil = require('gulp-util');
const GulpNotify = require('gulp-notify');
const Del = require('del');
const Notifier = require('node-notifier');
const Path = require('path');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');


const Config = require('./config');
const WebpackConfig = require('./webpack.config');

Gulp.task('clean', function(callback) {
	return Del([
		'dist/*'
	], callback);
});

// Compiling
// ---------

Gulp.task('scripts', function(callback) {
	var compiler = Webpack(WebpackConfig);

	compiler.run(function(err, stats) {
		if (err) return callback(new Gutil.PluginError('webpack', err));

		Gutil.log('[webpack]', stats.toString({
			colors: true,
			chunks: false
		}));

		callback();
	});
});

Gulp.task('public-files', function() {
	const src = Config.assets.public.src;
	const dist = Config.assets.public.dist;

	Gulp.src(Path.join(src, '**'), { base: src })
		.pipe(Gulp.dest(dist));
});

Gulp.task('compile', ['public-files', 'scripts']);

// Development server
// ------------------

Gulp.task('start', ['public-files'], function(callback) {
	const compiler = Webpack(WebpackConfig);

	// notifications on errors
	compiler.plugin('done', function(stats) {
		if (!stats.hasWarnings() && !stats.hasErrors()) return;

		const error = stats.hasErrors() ? stats.compilation.errors[0] : stats.compilation.warnings[0];

		if (!error) return;

		var errorMessage;

		if (error.module && error.module.rawRequest && error.error && error.error.toString()) {
			errorMessage = error.module.rawRequest + '\n' + error.error.toString();
		}

		Notifier.notify({
			title: 'Scripts compilation error',
			message: 'Webpack error: ' + errorMessage,
			sound: 'Frog',
			icon: Path.join(__dirname, 'node_modules/gulp-notify/assets/gulp-error.png')
		})
	});

	const server = new WebpackDevServer(compiler, {
		contentBase: Config.assets.public.dist,

		// server options
		publicPath: WebpackConfig.output.publicPath,

		historyApiFallback: true,

		hot: true,

		stats: {
			colors: true,
			chunks: false
		}
	})

	server.listen(3000, 'localhost', function(err) {
		if (err) throw new Gutil.PluginError('webpack-dev-server', err);

		Gutil.log('[webpack-dev-server]', 'Development server listening at http://localhost:3000');

		// we're not calling the task callback to keep this alive and running
	})

	// watch the public files as well
	Gulp.watch(Path.join(Config.assets.public.src, '**'), ['public-files']);
});