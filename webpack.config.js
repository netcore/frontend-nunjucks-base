const webpack = require('webpack')

module.exports = {
	output: {
		filename: 'app.bundle.js',
	},

	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
				query: {
					presets: [
						['env', { modules: false }]
					]
				}
			},
			{
				test: /\.vue$/,
				exclude: /(node_modules)/,
				loader: 'vue-loader',
				options: {
					loaders: {
						js: {
							loader: 'babel-loader',
							options: {
								cacheDirectory: true,
								presets: [
									['env', {
										'modules': false,
										'targets': {
											'browsers': ['> 2%'],
											uglify: true
										}
									}]
								],
								plugins: [
									'transform-object-rest-spread',
									['transform-runtime', {
										'polyfill': false,
										'helpers': false
									}]
								]
							}
						},
					}
				}
			}
		]
	},

	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery/dist/jquery',
			jQuery: 'jquery/dist/jquery'
		})
	],

	resolve: {
		alias: {
			vue: 'vue/dist/vue.js'
		}
	}
}