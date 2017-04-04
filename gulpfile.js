'use strict';
const config = require('./gulp.config.js')();
const gulp = require('gulp');
const concat = require('gulp-concat');
const loadPlugins = require('gulp-load-plugins');
const browserify = require('browserify');
const vinylSourceStream = require('vinyl-source-stream');
const vinylBuffer = require('vinyl-buffer');
const series = require('stream-series');
const runSequence = require('run-sequence');
const mainBowerFiles = require('main-bower-files');
const Gplugins = loadPlugins();
const argv = require('yargs').argv;
const env = process.env.NODE_ENV || 'development';
let optimize = false;

if (env === 'production') {
	console.log('static files will be optimized!!');
	optimize = true;
}

const paths = {
	js: ['./server/**/*.js', './public/**/*.js'],
	nonJs: ['./package.json', './.gitignore'],
	tests: './tests/*.js'
};

/**
 * Compiling jade into html for components.
 */
gulp.task('compile-jade', () => {
	console.log('compiling jade into html');

	return gulp
		.src(`${config.appFolder }**/*.jade`)
		.pipe(Gplugins.jade())
		.pipe(Gplugins.htmlmin())
		.pipe(gulp.dest(config.appFolder));
});

gulp.task('watch', function() {
	gulp.watch([config.files.jade], ['inject']);
	gulp.watch([config.files.js], ['inject']);
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
		.pipe(Gplugins.if(optimize, Gplugins.rev()))
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


gulp.task('images', () => {
	log('optimizing images for deliver');
	gulp.src(`${config.images }**/*`)
		.pipe(Gplugins.imagemin())
		.pipe(gulp.dest(`${config.build }images`));

});

gulp.task('clean-fonts', () => {
	gulp.src(config.fonts)
		.pipe(Gplugins.clean())
});


gulp.task('iconfont', ['clean-fonts'], (done) => {
	const iconStream = gulp.src(['./client/assets/icons/*.svg'])
		.pipe(Gplugins.iconfont({fontName: config.projectName}));

	async.parallel([
		function handleGlyphs(cb) {
			iconStream.on('glyphs', (glyphs) => {
				gulp.src('./client/assets/icons/icon-font.scss')
					.pipe(Gplugins.consolidate('lodash', {
						glyphs,
						fontName: config.projectName,
						fontPath: './fonts/',
						className: 'icon'
					}))
					.pipe(gulp.dest('./client/scss/base/'))
					.on('finish', cb);
			});
		},
		function handleFonts(cb) {
			iconStream
				.pipe(gulp.dest('./client/assets/fonts/'))
				.on('finish', cb);
		}
	], done);
});


gulp.task('fonts', ['iconfont'], () => {

	log('copy fonts to build folder');

	return gulp
		.src(`${config.fonts }**/*`)
		.pipe(gulp.dest(`${config.build }fonts`));

});


/**
 * Build!!!!
 */
gulp.task('build', ['styles-lib', 'styles-app', 'scripts-lib', 'scripts-app']);


/**
 * merge all i18n json files
 */
gulp.task('i18n', () => {
	log('merge all i18n json files');

	config.locales.map((locale) => {

		gulp.src(`${config.appFolder }**/i18n/${ locale }.json`)
			.pipe(Gplugins.mergeJson('translation.json'))
			.pipe(gulp.dest(`${config.build }i18n/${ locale}`))


	});


});


/**
 * Cleans build folder.
 */
gulp.task('clean', () => {
	log('clean build folder');

	return gulp
		.src(config.build, {read: false})
		.pipe(Gplugins.clean());
});


gulp.task('release', () => runSequence('clean', 'bundle'));

// gulp serve for development
gulp.task('default', () => runSequence('clean', 'bundle', 'serve-dev'));


gulp.task('serve-dev', () => {
	serve(true /*isDev*/);
});


/**
 * Create build bundle.
 */
gulp.task('bundle', ['inject']);


/**
 * Create build bundle.
 */
gulp.task('wiredep', ['inject']);

/**
 * serve the code
 * --debug-brk or --debug
 * --nosync
 * @param  {Boolean} isDev - dev or build mode
 * @param  {Boolean} specRunner - server spec runner html
 */
function serve(isDev) {

	const nodeOptions = {
		script: 'server/index.js',
		nodeArgs: ['--debug=5820'],
		watch: 'server/*',
		delay: 1000,
		env: {
			'DEBUG': 'app:server'
		}
	};

	return Gplugins.nodemon(nodeOptions)
		.on('restart', (ev) => {
			log('*** nodemon restarted');
			log(`files changed:\n${ ev}`);
			setTimeout(() => {
				browserSync.notify('reloading now ...');
				browserSync.reload({stream: false});
			}, config.browserReloadDelay);
		})
		.on('start', () => {
			log('*** nodemon started');
			startBrowserSync(isDev);
		})
		.on('crash', () => {
			log('*** nodemon crashed: script crashed for some reason');
		})
		.on('exit', () => {
			log('*** nodemon exited cleanly');
		});
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
	if (typeof(msg) === 'object') {
		for (const item in msg) {
			if (msg.hasOwnProperty(item)) {
				Gplugins.util.log(Gplugins.util.colors.blue(msg[item]));
			}
		}
	} else {
		Gplugins.util.log(Gplugins.util.colors.blue(msg));
	}
}

/**
 * When files change, log it
 * @param  {Object} event - event that fired
 */
function changeEvent(event) {
	const srcPattern = new RegExp(`/.*(?=/${ config.source })/`);
	log(`File ${event.path.replace(srcPattern, '')} ${event.type}`);
}

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 */
function startBrowserSync(isDev) {

	if (argv.nosync || browserSync.active) {
		return;
	}

	const port = 5001;
	log(`Starting BrowserSync on port ${port}`);


	gulp.watch(config.files.sass, ['bs-reload'])
		.on('change', changeEvent);

	gulp.watch(config.files.js, ['bs-reload'])
		.on('change', changeEvent);

	gulp.watch([config.files.jade], ['bs-reload'])
		.on('change', changeEvent);

	gulp.watch([config.files.json], ['bs-reload'])
		.on('change', changeEvent);


	const options = {
		proxy: `dev.almundo.com:${port}`,
		port: 3000,
		files: isDev ? [] : [],
		ghostMode: { // these are the defaults t,f,t,t
			clicks: true,
			location: false,
			forms: true,
			scroll: true
		},
		injectChanges: true,
		logFileChanges: true,
		logLevel: 'info',
		logPrefix: config.projectName,
		notify: true,
		reloadDelay: 1000,
		reloadDebounce: 2000,
		startPath: '/trips/'

	};


	browserSync(options);
}
