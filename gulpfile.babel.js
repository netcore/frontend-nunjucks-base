import gulp from 'gulp'
import nunjucksRender from 'gulp-nunjucks-render'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'
import imagemin from 'gulp-imagemin'
import svgmin from 'gulp-svgmin'
import del from 'del'
import webpackStream from 'webpack-stream'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpack from 'webpack'
import browserSync from 'browser-sync'
import config from './webpack.config.js'

const bundler = webpack(config)
const browser = browserSync.create()

const paths = {
    // source files
    src: {
        html: [
            './src/views/pages/*.html',
            './src/views/**/*.html'
        ],
        sass: [
            './src/assets/sass/app.{sass,scss}',
            './src/assets/sass/**/*.{sass,scss}'
        ],
        js: './src/main.js',
        images: [
            './src/assets/images/*.{jpg,jpeg,png,gif,svg}',
            './src/assets/images/**/*.{jpg,jpeg,png,gif,svg}'
        ],
        svg: [
            './src/assets/svg/*.svg',
            './src/assets/svg/**/*.svg'
        ],
        favicon: './src/assets/favicon/*.{ico,png,json,svg,xml,webmanifest}',
        json: './src/assets/json/*.json',
        fonts: './src/assets/fonts/**/*.{ttf,otf,eot,woff,woff2,svg}'
    },
    // destination folders
    dest: {
        html: './public/',
        sass: './public/',
        favicon: './public/assets/favicon/',
        images: './public/assets/images/',
        svg: './public/assets/svg/',
        json: './public/assets/json/',
        fonts: './public/assets/fonts/',
        js: './public/'
    }
}

// ==========

// task: compile:markup
const compileMarkup = () => {
    return gulp.src(paths.src.html[0])
        .pipe(nunjucksRender({
            data: {
                date: new Date(),
                time: Date.now()
            }
        }))
        .pipe(gulp.dest(paths.dest.html))
        .pipe(browser.stream({ once: true }))
}

// task: watch:markup
const watchMarkup = () => gulp.watch(paths.src.html, compileMarkup)

// ==========

// task: compile:sass
const compileSass = () => {
    return gulp.src(paths.src.sass[0])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({ compatibility: 'ie9' }))
        .pipe(gulp.dest(paths.dest.sass))
        .pipe(browser.stream({ once: true }))
}

// task: watch:sass
const watchSass = () => gulp.watch(paths.src.sass, compileSass)

// ==========

// task: build:js
const buildJs = () => {
    return gulp.src(paths.src.js)
        .pipe(webpackStream(config))
        .pipe(gulp.dest(paths.dest.js))
}

// ==========

// task: build:favicon
const buildFavicon = () => {
    return gulp.src(paths.src.favicon)
        .pipe(gulp.dest(paths.dest.favicon))
        .pipe(browser.stream({ once: true }))
}

// task: watch:favicon
const watchFavicon = () => gulp.watch(paths.src.favicon, buildFavicon)

// ==========

// task: minify:images
const minifyImages = () => {
    return gulp.src(paths.src.images)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.dest.images))
        .pipe(browser.stream({ once: true }))
}

// task: watch:images
const watchImages = () => gulp.watch(paths.src.images, minifyImages)

// ==========

// task: minify:svg
const minifySvg = () => {
    return gulp.src(paths.src.svg)
        .pipe(svgmin())
        .pipe(gulp.dest(paths.dest.svg))
        .pipe(browser.stream({ once: true }))
}

// task: watch:svg
const watchSvg = () => gulp.watch(paths.src.svg, minifySvg)

// ==========

// task: build:json
const buildJson = () => {
    return gulp.src(paths.src.json)
        .pipe(gulp.dest(paths.dest.json))
        .pipe(browser.stream({ once: true }))
}

// task: watch:json
const watchJson = () => gulp.watch(paths.src.json, buildJson)

// ==========

// task: build:fonts
const buildFonts = () => {
    return gulp.src(paths.src.fonts)
        .pipe(gulp.dest(paths.dest.fonts))
        .pipe(browser.stream({ once: true }))
}

// task: watch:fonts
const watchFonts = () => gulp.watch(paths.src.fonts, buildFonts)

// ==========

// task: delete public folder content
const clean = () => {
    return del(['./public/'], { force: true })
}

// ==========

// task: run:server
const server = () => {
    let config = {
        server: './public',
        notify: false,
        middleware: [
            webpackDevMiddleware(bundler),
            webpackHotMiddleware(bundler)
        ]
    }

    browser.init(config)
}

// ==========

const compile = gulp.parallel(compileMarkup, compileSass, buildJs, buildFavicon, minifyImages, minifySvg, buildJson, buildFonts)

const serve = gulp.series(clean, compile)

const watch = gulp.parallel(watchMarkup, watchSass, watchFavicon, watchImages, watchSvg, watchJson, watchFonts)

export {
    compile,
    clean,
    server,
    compileMarkup,
    compileSass,
    buildJs,
    buildFavicon,
    minifyImages,
    minifySvg,
    buildJson,
    buildFonts,
    serve,
    watch,
    watchMarkup,
    watchSass,
    watchFavicon,
    watchImages,
    watchSvg,
    watchJson,
    watchFonts
}

exports.dev = gulp.series(serve, gulp.parallel(server, watch))
exports.prod = gulp.series(serve)
