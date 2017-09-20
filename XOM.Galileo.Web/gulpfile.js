/// <binding Clean='clean' ProjectOpened='watch, bower' />

'use strict';

// Load plugins
var gulp = require('gulp'),
    angularTemplatecache = require('gulp-angular-templatecache'),
    autoprefixer = require('gulp-autoprefixer'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    git = require('gulp-git'),
    imagemin = require('gulp-imagemin'),
    ngConfig = require('gulp-ng-config'),
    rename = require('gulp-rename'),
    replace = require('gulp-replace'),
    sass = require('gulp-sass'),
    uglify = require('uglify-es'), // ecma default: 5; For example: an ecma setting of 5 will not convert ES6+ code to ES5.
    composer = require('gulp-uglify/composer'),
    minify = composer(uglify, console),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    pump = require('pump'),
    merge = require('stream-series'),
    karmaServer = require('karma').Server,
    bower = require('gulp-bower'),
    eslint = require('gulp-eslint'),
    gulpif = require('gulp-if'),
    sequence = require('run-sequence'),
    csslint = require('gulp-csslint'),
    sassLint = require('gulp-sass-lint');

// Environment settings.
var envs = {
    local: {
        name: 'local',
        js: {
            lint: false,
            minify: false,
            mangle: false,
            concat: true,
            sourcemaps: true
        },
        css: {
            lint: false,
            minify: false,
            mangle: false,
            concat: true,
            sourcemaps: true
        }
    },
    dev: {
        name: 'dev',
        js: {
            lint: true,
            minify: true,
            mangle: false,
            concat: true,
            sourcemaps: true
        },
        css: {
            lint: true,
            minify: false,
            mangle: false,
            concat: true,
            sourcemaps: true
        }
    },
    acc: {
        name: 'acc',
        js: {
            lint: false,
            minify: true,
            mangle: true,
            concat: true,
            sourcemaps: false
        },
        css: {
            lint: false,
            minify: true,
            mangle: true,
            concat: true,
            sourcemaps: false
        }
    },
    prd: {
        name: 'prd',
        js: {
            lint: false,
            minify: true,
            mangle: true,
            concat: true,
            sourcemaps: false
        },
        css: {
            lint: false,
            minify: true,
            mangle: true,
            concat: true,
            sourcemaps: false
        }
    }
};
var env = envs.local;

// Paths
var paths = {
    app: 'app/',
    dist: 'dist/',
    bower: 'bower_components/',
    tests: 'tests/',
    images: 'images/',
    fonts: 'fonts/'
};

// Globs
var globs = {
    sass: paths.app + '**/*.scss',
    js: paths.app + '**/*.js',
    tests: paths.tests + '**/*.test.js',
    configJson: paths.app + 'config.json',
    img: paths.images + '*',
    css: paths.app + '**/*.css',
    html: paths.app + '**/*.html',
    indexHtml: 'index.html',
    fonts: [
        paths.bower + 'unity/fonts/*',
        paths.bower + 'components-font-awesome/fonts/*'
    ],
    vendor: {
        // Order, order, order
        js: [
            paths.bower + '**/angular.js',
            paths.bower + '**/angular*.js',
            '!' + paths.bower + '**/angular*.min.js',
            paths.bower + 'angular-loading-bar/src/loading-bar.js',
            paths.bower + 'd3/d3.js',
            paths.bower + 'moment/moment.js',
            paths.bower + 'polyfills/polyfills.js',
            paths.bower + 'unity/**/!(*.min).js',
            paths.bower + 'angular-bootstrap/ui-bootstrap.js',
            paths.bower + 'angular-bootstrap/ui-bootstrap-tpls.js',
            paths.bower + 'html2canvas/build/html2canvas.js',
            paths.bower + 'pdfmake/build/pdfmake.js',
            paths.bower + 'pdfmake/build/vfs_fonts.js',
            paths.bower + 'jspdf/dist/jspdf.min.js'
        ],
        // Order, order, order
        jsMin: [
            paths.bower + '**/angular.min.js',
            paths.bower + '**/angular*.min.js',
            paths.bower + '**/angular-mocks.js', // no min version.
            paths.bower + 'angular-loading-bar/src/loading-bar.js',
            paths.bower + 'd3/d3.min.js',
            paths.bower + 'moment/min/moment.min.js',
            paths.bower + 'polyfills/polyfills.min.js',
            paths.bower + 'unity/**/!(*.min).js',
            paths.bower + 'angular-bootstrap/ui-bootstrap.min.js',
            paths.bower + 'angular-bootstrap/ui-bootstrap-tpls.min.js',
            paths.bower + 'html2canvas/build/html2canvas.min.js',
            paths.bower + 'pdfmake/build/pdfmake.min.js',
            paths.bower + 'pdfmake/build/vfs_fonts.js'
        ],
        css: [
            paths.bower + '**/!(*.min|bootstrap*).css',
            '!' + paths.bower + 'jspdf/**/*.css',
            paths.bower + 'components-font-awesome/css/font-awesome.css'
        ],
        cssMin: paths.bower + '**/*.min.css'
    },
    dist: {
        js: paths.dist + '**/*.js',
        jsMin: paths.dist + '**/*.min.js',
        css: paths.dist + '**/*.css',
        cssMin: paths.dist + '**/*.min.css'
    }
};

// Styles
gulp.task('styles', function (cb) {
    return pump(
        gulp.src(globs.sass),

        // source maps
        gulpif(env.css.sourcemaps === true, sourcemaps.init()),

        sass(),
        autoprefixer('last 2 version'),
        concat('app.css'),

        // minify
        gulpif(env.css.minify === true, cssmin()),

        // if minified, rename to .min
        gulpif(env.css.minify === true, rename({ suffix: '.min' })),

        // write to our destination.
        gulp.dest('dist/css')
    );
});

// Scripts
gulp.task('scripts', function () {
    console.log('Running scripts for env: ' + env.name);

    // Gets the config .js for an environment
    function getConfigs(env) {
        return pump(
            gulp.src(paths.app + 'config.json'),
            ngConfig('app', {
                wrap: true,
                createModule: false,
                pretty: true,
                environment: env.name
            })
        );
    }

    // Original src stream
    const stream = merge(
        pump(
            gulp.src([
                // Order matters - modules first
                paths.app + '**/*.module.js',
                globs.js
            ]),
            gulpif(env.js.sourcemaps === true, sourcemaps.init()), // not sure yet if this is actually working.
            concat('app.js')
        ),
        pump(
            gulp.src(globs.html),
            angularTemplatecache('app.templates.js', {
                root: paths.app,
                module: 'app'
            })
        )
    );

    // Create concat file based on environment settings.
    return pump(
        // Combine all js files.
        merge(stream, getConfigs(env)),

        // Concat into one file.
        concat('app.js'),

        // Minify and mange.
        gulpif(env.js.minify === true, minify({
            mangle: env.js.mangle === true
        })),

        // Rename file to .min.
        gulpif(env.js.minify === true, rename({
            suffix: '.min'
        })),

        // Sourcemaps.
        gulpif(env.js.sourcemaps === true, sourcemaps.write()),

        // Save file to dist.
        gulp.dest('dist/js')
    )
});

// ESLint of script files.
gulp.task('eslint', () => {
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    return gulp.src(['**/*.js'])
        // eslint() attaches the lint output to the "eslint" property
        // of the file object so it can be used by other modules.
        .pipe(eslint({ fix: true }))
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError());
});

// CSS Lint
gulp.task('csslint', function () {
    return gulp.src(globs.css)
    .pipe(csslint())
    .pipe(csslint.formatter());
});

// SCSS Lint
gulp.task('sasslint', function () {
    return gulp.src([globs.sass, '!app/unity-angular/**'])
    .pipe(sassLint({
        rules: {
            'indentation': [
                2,
                {
                    'size': 4
                }
            ],
            'final-newline': 0,
            'no-color-literals': 2
        },
        configFile: '.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Images
gulp.task('images', function () {
    return pump(
        gulp.src(paths.images + '*.svg'),
        cache(
            imagemin([
	            imagemin.gifsicle({ interlaced: true }),
	            imagemin.jpegtran({ progressive: true }),
	            imagemin.optipng({ optimizationLevel: 5 }),
	            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
            ])
        ),
        gulp.dest('dist/images')
    );

    // TODO: copy non-svg images. This has been too big of a challenge for this story.
});

// Fonts
gulp.task('fonts', function () {
    return pump(
        gulp.src(globs.fonts),
        rename({ dirname: '' }),
        gulp.dest('dist/fonts')
    )
});

// HTML
gulp.task('html', function () {
    let jsregex = {
        assetsMatch: /((?:<!\.min)\.(js))/g, ///((?:src|href)=["']?)(.*\/)(.*\/.*(?:js|min\.js)["'> ])/g,
        assetsOutput: '$1$3',
        minMatch: /((?:src|href)=["']?.*)(js|min\.js)(["'> ])/g,
        minOutput: '$1min.$2$3'
    };
    let cssregex = {
        assetsMatch: /((?:<!\.min)\.(css))/g,
        assetsOutput: '$1$3',
        minMatch: /((?:src|href)=["']?.*)(css|min\.css)(["'> ])/g,
        minOutput: '$1min.$2$3'
    };

    // index.html
    return pump(
        gulp.src(globs.indexHtml),
        //gulpif(env.js.minify === true, replace(jsregex.assetsMatch, jsregex.assetsOutput)),
        //gulpif(env.css.minify === true, replace(cssregex.assetsMatch, cssregex.assetsOutput)),
        //gulpif(env.js.minify === true, replace(jsregex.minMatch, jsregex.minOutput)),
        //gulpif(env.css.minify === true, replace(cssregex.minMatch, cssregex.minOutput)),
        gulpif(env.js.minify === true, replace('app.js', 'app.min.js'), replace('app.min.js', 'app.js')),
        gulpif(env.css.minify === true, replace('app.css', 'app.min.css'), replace('app.min.css', 'app.css')),
         gulpif(env.js.minify === true, replace('vendor.js', 'vendor.min.js'), replace('vendor.min.js', 'vendor.js')),
        gulpif(env.css.minify === true, replace('vendor.css', 'vendor.min.css'), replace('vendor.min.css', 'vendor.css')),
        gulp.dest('')
    );
});

// Vendor
gulp.task('vendor', function () {
    const isMinCss = env.css.minify === true;
    const isMinJs = env.js.minify === true;

    return merge(
        pump(
            // Get css files.
            gulp.src(globs.vendor.css),

            // source maps
            gulpif(env.css.sourcemaps === true, sourcemaps.init()),

            // Minify ourselves instead of using the pre-minified versions.
            // Could expose errors that the library didn't find using their own. Adjust later for that case if it comes up.
            // Most of our libraries don't already include min css files.
            gulpif(isMinCss, cssmin()),

            // Concatenate all css files into one file.
            concat(isMinCss ? 'vendor.min.css' : 'vendor.css'),

            // Finish source maps after concatination.
            gulpif(env.css.sourcemaps === true, sourcemaps.write()),

            // write to directory
            gulp.dest('dist/css')
        ),
        pump(
            // Get js files, depending on minify settings.
            isMinJs ? gulp.src(globs.vendor.jsMin) : gulp.src(globs.vendor.js),

            // Concatenate all js files into one file.
            concat(isMinJs ? 'vendor.min.js' : 'vendor.js'),

            // write to directory
            gulp.dest('dist/js')
        )
    );
});

// Tests
gulp.task('tests', function (done) {
    // Run tests once and exit.
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
});
gulp.task('tdd', function (done) {
    // Watch for file changes and re-run tests on each change.
    new karmaServer({
        configFile: __dirname + '/karma.conf.js'
    }, done).start();
});

// Bower
gulp.task('bower', function () {
    return bower();
});

// Clean
gulp.task('clean', function () {
    return del([paths.dist]);
});

// Build
gulp.task('build:local', function () {
    env = envs.local;
    sequence('clean', ['styles', 'scripts', 'images', 'html', 'fonts', 'vendor'], ['tdd', 'watch']);
});
gulp.task('build:dev', function () {
    env = envs.dev;
    sequence('clean', ['styles', 'scripts', 'images', 'html', 'fonts', 'vendor'], 'quality');
});
gulp.task('build:acc', function () {
    env = envs.acc;
    gulp.start('default');
});
gulp.task('build:prd', function () {
    env = envs.prd;
    gulp.start('default');
});

// All quality related tasks.
gulp.task('quality', function () {
    gulp.start('eslint', 'csslint', 'sasslint', 'tests');
});

// Default task => build
gulp.task('default', ['clean'], function () {
    gulp.start('styles', 'scripts', 'images', 'html', 'fonts', 'vendor');
});

// Watch
gulp.task('watch', function () {
    // .scss files
    gulp.watch(globs.sass, ['styles']);

    // .js files
    // config.json
    // app/*.html
    gulp.watch([globs.js, globs.configJson, globs.html], ['scripts']);

    // image files
    gulp.watch(globs.img, ['images']);

    // index.html
    gulp.watch(globs.indexHtml, ['html']);
});

// Git command to help with international keyboards
// and CR / CRLF differences adding unstaged local
// uncommitted changes.
gulp.task('git-diff', function () {
    git.exec({ args: 'diff -R' }, function (err) {
        if (err) throw err;
    });
});

///////////////