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
				loader: 'vue-loader'
			}
		]
	},

	plugins: [],

	resolve: {
		alias: {
			vue: 'vue/dist/vue.js'
		}
	}
}