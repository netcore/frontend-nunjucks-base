const path = require('path')
const webpack = require('webpack')
const { VueLoaderPlugin } = require('vue-loader')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const process = require('process')
const webpackUglify = require('uglifyjs-webpack-plugin')

const isProduction = (process.env.NODE_ENV === 'production')

let entries = [
    '@babel/polyfill',
    './src/main.js'
]

let plugins = [
    new webpack.ProvidePlugin({
        $: 'jquery/dist/jquery',
        jQuery: 'jquery/dist/jquery',
        'window.jQuery': 'jquery/dist/jquery'
    }),
    new VueLoaderPlugin(),
]

if (!isProduction) {
    entries.push('webpack/hot/dev-server', 'webpack-hot-middleware/client')

    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new HardSourceWebpackPlugin()
    )
}

if (isProduction) {
    plugins.push(
        new webpackUglify({
            parallel: 2,
            uglifyOptions: {
                mangle: false,
                output: {
                    comments: false,
                    beautify: false
                }
            }
        })
    )
}

module.exports = {
    mode: 'none',

    entry: entries,

    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'public')
    },

    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ['@babel/preset-env', {
                            'useBuiltIns': false
                        }]
                    ]
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                query: {
                    presets: [
                        ['@babel/preset-env', {
                            'useBuiltIns': false
                        }]
                    ]
                }
            }
        ]
    },

    plugins: plugins,

    resolve: {
        alias: {
            vue: isProduction ? 'vue/dist/vue.min.js' : 'vue/dist/vue.js'
        }
    }
}
