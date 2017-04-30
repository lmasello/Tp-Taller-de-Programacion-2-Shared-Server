'use strict';
const config = require('./gulp.config.js')();
const gulp = require('gulp');
const concat = require('gulp-concat');
const loadPlugins = require('gulp-load-plugins');
const browserify = require('browserify');
const series = require('stream-series');
const mainBowerFiles = require('main-bower-files');
const Gplugins = loadPlugins();
const env = process.env.NODE_ENV || 'development';
const browserSync = require('browser-sync');
let optimize = false;

if (env === 'production') {
	console.log('static files will be optimized!!');
	optimize = true;
}

/**
 * Compiling jade into html for components.
 */
gulp.task('compile-jade', () => {
	console.log('compiling jade into html');

	return gulp
		.src(config.files.jade)
		.pipe(Gplugins.jade())
		.pipe(Gplugins.htmlmin())
		.pipe(gulp.dest('./client'));
});

/**
 * Concat app js files.
 */
gulp.task('scripts-app', () => {
	console.log('create app js files');
	return gulp
		.src(config.files.js)
		.pipe(Gplugins.order(config.jsOrder))
		.pipe(concat(`${config.projectName }.js`))
		.pipe(Gplugins.ngAnnotate({add: true, single_quotes: true}))
		.pipe(gulp.dest(config.build));

});

/**
 * Compiling scss into css.
 */
gulp.task('styles-app', () => {
	console.log('compiling app scss into css');
	return gulp
		.src(config.mainscss)
		.pipe(Gplugins.sass())
		.pipe(Gplugins.rename(`${config.projectName}.css`))
		.pipe(Gplugins.if(optimize, Gplugins.csso()))
		.pipe(Gplugins.if(optimize, Gplugins.rev()))
		.pipe(gulp.dest(config.build));
});

/**
 * Concat vendor js files.
 */
gulp.task('scripts-lib', () => {
	console.log('concat vendor js files');
	return gulp
		.src(mainBowerFiles('**/*.js'))
		.pipe(Gplugins.concat(`${config.projectName }-lib.js`))
		.pipe(Gplugins.if(optimize, Gplugins.uglify()))
		.pipe(Gplugins.if(optimize, Gplugins.stripDebug()))
		.pipe(Gplugins.if(optimize, Gplugins.rename({extname: '.min.js'})))
		.pipe(gulp.dest(config.build));
});


gulp.task('styles-lib', () => {
	console.log('concat lib css');
	return gulp
		.src(mainBowerFiles('**/*.css'))
		.pipe(Gplugins.concat(`${config.projectName }-lib.css`))
		.pipe(Gplugins.if(optimize, Gplugins.csso()))
		.pipe(Gplugins.if(optimize, Gplugins.rename({extname: '.min.css'})))
		.pipe(Gplugins.if(optimize, Gplugins.rev()))
		.pipe(gulp.dest(config.build));
});

gulp.task('inject', ['build', 'compile-jade'], () => {
	console.log('inject dependencies in index');
	// It's not necessary to read the files (will speed up things), we're only after their paths:
	const styleLib = gulp.src([`${config.build}*lib*.css`], {read: false});
	const scriptLib = gulp.src([`${config.build}*lib*.js`], {read: false});
	const styleApp = gulp.src([`${config.build}*.css`, `!${config.build}*lib*.css`], {read: false});
	const scriptApp = gulp.src([`${config.build}*.js`, `!${config.build}*lib*.js`], {read: false});

	const injectOptions = {
		//addRootSlash: false,
		//ignorePath: config.build.replace('./', '').replace('/', ''),
	};

	return gulp.src(`${config.views}index.jade`)
		.pipe(Gplugins.inject(series(styleLib, scriptLib, styleApp, scriptApp), injectOptions))
		.pipe(gulp.dest(config.views));

});

/**
 * Build!!!!
 */
gulp.task('build', ['styles-lib', 'styles-app', 'scripts-lib', 'scripts-app']);



/**
 * Cleans build folder.
 */
gulp.task('clean', () => {
	log('clean build folder');

	return gulp
		.src(config.build, {read: false})
		.pipe(Gplugins.clean());
});


gulp.task('default', ['build']);

gulp.task('bs-reload', ['styles-lib', 'styles-app', 'scripts-lib', 'scripts-app', 'compile-jade'], browserSync.reload);

gulp.task('serve-dev', ['browser-sync'], () => {});

/**
 * BrowserSync is a Monitor, listening changes in client code, and refreshing all
 * browsers connected. Before refreshing, all styles and source code is compiled
 */
gulp.task('browser-sync', ['nodemon'], () => {
    gulp.watch(config.files.sass, ['bs-reload']);
    gulp.watch(config.files.js, ['bs-reload']);
    gulp.watch([config.files.jade], ['bs-reload']);

    browserSync.init(null, {
        proxy: "http://localhost:3000",
        files: ["client/**/*.*"],
        browser: "google chrome",
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'info',
        port: 5000,
        logPrefix: config.projectName,
        notify: false
    });
});

/**
 * Start nodemon task.
 * Nodemon monitor for any changes in nodejs server and automatically restart the server
 */
gulp.task('nodemon', function (cb) {

    var started = false;

    return Gplugins.nodemon({
        watch: 'server/*',
        script: 'bin/www.js'
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    });
});