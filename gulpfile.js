let gulp = require('gulp')
let nunjucksRender = require('gulp-nunjucks-render')
let htmlmin = require('gulp-htmlmin')
let browserSync = require('browser-sync').create()
let sass = require('gulp-sass')
let autoprefixer = require('gulp-autoprefixer')
let imagemin = require('gulp-imagemin')
let webpack = require('webpack')
let webpackStream = require('webpack-stream')
let del = require('del')
let cleanCSS = require('gulp-clean-css')
let gulpif = require('gulp-if')
let plumber = require('gulp-plumber')
let webpackUglify = require('uglifyjs-webpack-plugin')

let webpackConfig = require('./webpack.config.js')
let env	= 'development'
let resourcesFolder = 'app/resources/'
let publicFolder = 'app/public/'

// paths
const paths = {
	// source files
	src: {
		html: [
			resourcesFolder + 'views/_pages/**/*.+(html)',
			resourcesFolder + 'views/**/**/*.+(html)'
		],
		sass: [
			resourcesFolder + 'assets/sass/*.{sass,scss}',
			resourcesFolder + 'assets/sass/**/*.{sass,scss}'
		],
		img: [
			resourcesFolder + 'assets/img/**/*.{jpg,jpeg,png,gif,svg}',
			resourcesFolder + 'assets/img/*.{jpg,jpeg,png,gif,svg}'
		],
		imgMin: [
			resourcesFolder + 'assets/img/**/*.{png,gif}',
			resourcesFolder + 'assets/img/*.{png,gif}'
		],
		fonts: [
			resourcesFolder + 'assets/fonts/**/*.{ttf,otf,eot,woff,woff2,svg}'
		],
		js: [
			resourcesFolder + 'assets/js/app.js',
			resourcesFolder + 'assets/js/**/*.{js,vue}'
		],
		svg: resourcesFolder + 'assets/svg/**/*.{jpg,jpeg,png,gif,svg}',
		json: [
			resourcesFolder + 'assets/json/*.json',
			resourcesFolder + 'assets/json/**/*.json'
		]
	},

	// destination folders
	dest: {
		html: publicFolder,
		css: publicFolder + 'assets/css',
		img: publicFolder + 'assets/img',
		fonts: publicFolder + 'assets/fonts',
		js: publicFolder + 'assets/js',
		svg: publicFolder + 'assets/svg',
		json: publicFolder + 'assets/json'
	}
}

// task: compile:html
gulp.task('compile:html', () => {
	browserSync.notify('Running: compile:html')

	return gulp.src(paths.src.html[0])
		.pipe(plumber())
		.pipe(nunjucksRender({
			path: ['app'],
			data: {
				date: new Date( new Date().getTime() + 3 * 3600 * 1000).toUTCString().replace( / GMT$/, "" ),
				time: Date.now()
			}
		}))
		.pipe(gulpif(env === 'production', htmlmin({ collapseWhitespace: true })))
		.pipe(gulp.dest(paths.dest.html))
		.pipe(browserSync.stream({ once: true }))
})

// task: compile:sass
gulp.task('compile:sass', () => {
	browserSync.notify('Running: compile:sass')

	return gulp.src(paths.src.sass[0])
		.pipe(plumber())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(cleanCSS({ compatibility: 'ie9' }))
		.pipe(gulp.dest(paths.dest.css))
		.pipe(browserSync.stream())
})

// task: build:img
gulp.task('build:img', () => {
	browserSync.notify('Running: build:img')

	return gulp.src(paths.src.img)
		.pipe(gulp.dest(paths.dest.img))
		.pipe(browserSync.stream({ once: true }))
})

// task: minify:img
gulp.task('minify:img', () => {
	browserSync.notify('Running: minify:img')

	return gulp.src(paths.src.imgMin)
		.pipe(plumber())
		.pipe(gulpif(env === 'production', imagemin()))
		.pipe(plumber.stop())
		.pipe(gulp.dest(paths.dest.img))
})

// task: build:json
gulp.task('build:json', () => {
	browserSync.notify('Running: build:json')

	return gulp.src(paths.src.json)
		.pipe(gulp.dest(paths.dest.json))
		.pipe(browserSync.stream({ once: true }))
})

// task: build:svg
gulp.task('compile:svg', () => {
	browserSync.notify('Running: compile:svg')

	return gulp.src(paths.src.svg)
		.pipe(plumber())
		.pipe(imagemin())
		.pipe(gulp.dest(paths.dest.svg))
		.pipe(browserSync.stream({ once: true }))
})

// task: build:fonts
gulp.task('build:fonts', () => {
	browserSync.notify('Running: build:fonts')

	return gulp.src(paths.src.fonts)
		.pipe(gulp.dest(paths.dest.fonts))
		.pipe(browserSync.stream({ once: true }))
})

// task: build:js
gulp.task('build:js', () => {
	browserSync.notify('Running: build:js')

	if (env === 'production') {
		webpackConfig.plugins.push(
			new webpackUglify({
				parallel: 2,
				cache: true,
				uglifyOptions: {
					mangle: false,
					output: {
						comments: false,
						beautify: false
					}
				}
			})
		)

		webpackConfig.resolve.alias['vue'] = 'vue/dist/vue.min'
	}

	return gulp.src(paths.src.js[0])
		.pipe(plumber())
		.pipe(webpackStream(webpackConfig), webpack)
		.pipe(gulp.dest(paths.dest.js))
		.pipe(browserSync.stream({ once: true }))
})

// task: browser-sync
gulp.task('browser-sync', () => {
	browserSync.init({
		server: {
			baseDir: './app/public'
		}
	})
})

// task: clean:build
gulp.task('clean:build', () => {
	return del(['app/public/*'], { force: true })
})

// task: default
gulp.task('default', ['clean:build'], () => {
	return gulp.start('compile:html', 'compile:sass', 'build:img', 'minify:img', 'compile:svg', 'build:json', 'build:fonts', 'build:js')
})

// task: production
gulp.task('prod', () => {
	env = 'production'

	return gulp.start('default')
})

// task: development
gulp.task('dev', ['watch', 'browser-sync'])

// task: watch
gulp.task('watch', ['default'], () => {
	gulp.watch(paths.src.sass, ['compile:sass'])
	gulp.watch(paths.src.fonts, ['build:fonts'])
	gulp.watch(paths.src.img, ['build:img'])
	gulp.watch(paths.src.json, ['build:json'])
	gulp.watch(paths.src.js, ['build:js'])
	gulp.watch(paths.src.svg, ['compile:svg'])
	gulp.watch(paths.src.html, ['compile:html'])
})