var Path = require('path');
var Webpack = require('webpack');
var Autoprefixer = require('autoprefixer');

var Config = require('./config');

// var cssModuleClassName = '[path]___[local]___[hash:base64:5]';
var cssModuleClassName = '[local]___[hash:base64:5]';

module.exports = {
		devtool: 'eval', // source maps
		entry: [
			'webpack-dev-server/client?http://localhost:3000', // required for hot reloading
			'webpack/hot/only-dev-server', // required for hot reloading
			'./src/assets/scripts/app.js'
		],

		output: {
			path: Config.assets.scripts.dist,
			filename: 'app.js',
			publicPath: '/scripts/'
		},

		resolve: {
			extensions: ['', '.js', '.jsx', '.json']
		},

		module: {
			loaders: [
				{ 
					test: /\.jsx?$/, 
					loader: 'babel',
					include: [
						Path.join(__dirname, './src')
					],
					exclude: /(node_modules)/,
					query: {
						presets: ["babel-preset-react", "babel-preset-es2015"]
					}
				},
				{ test: /\.json/, loaders: ['json'] },
				{ 
					test: /\.less$/,
					loaders: [
						'style-loader?sourceMap',
						'css-loader?modules&sourceMap&importLoaders=1&localIdentName='+cssModuleClassName+'!postcss-loader',
						'less-loader?sourceMap'
					]
				}
			]
		},

		postcss: [
			Autoprefixer({ browsers: ["last 2 versions", "> 1%", "ie 9"]})
		],

		plugins: [
			new Webpack.HotModuleReplacementPlugin(),
			new Webpack.NoErrorsPlugin()
		]
	}