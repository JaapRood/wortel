const Path = require('path');

const envName = process.env.NODE_ENV;
const env = {
	development: !envName || envName === 'development',
	staging: envName === 'staging',
	production: envName === 'production',
	test: envName === 'test'
};

module.exports = {
	env: env,

	product: {
		name: 'Wastemate.js'
	},

	assets: {
		scripts: { 
			src: Path.join(__dirname, './src/assets/scripts'),
			dist: Path.join(__dirname, './dist/assets/scripts')
		},
		public: {
			src: Path.join(__dirname, './src/assets/public'),
			dist: Path.join(__dirname, './dist/assets/public')
		}
	},
};