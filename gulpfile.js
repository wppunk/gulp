/**
 * Load gulp config
 */
const config = require('./configs/global-config');

/**
 * Load Plugins.
 *
 * Load gulp plugins and assign them semantic names.
 */
const gulp = require('gulp');

// CSS related plugins.
const sass = require('gulp-sass');
const mmq = require('gulp-merge-media-queries');
const minifycss = require('gulp-uglifycss');
const autoprefixer = require('gulp-autoprefixer');
// JS related plugins.
const uglify = require('gulp-uglify-es').default;
const babel = require('gulp-babel');

// Image realted plugins.
const imagemin = require('gulp-imagemin');

// Utility related plugins.
const rename = require('gulp-rename');
const lineec = require('gulp-line-ending-corrector');
const filter = require('gulp-filter');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const gulpif = require('gulp-if');
const cache = require('gulp-cache');
const plumber = require('gulp-plumber');
const remember = require('gulp-remember');
const clean = require('gulp-clean');
const groupConcat = require('gulp-group-concat');
const beep = require('beepbeep');
const {readdirSync} = require('fs');

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 * @link http://www.browsersync.io/docs/options/
 *
 * @param {Mixed} done Done.
 */
const browsersync = done => {
    browserSync.init({
        proxy: config.projectURL,
        open: true,
        injectChanges: true,
        watchEvents: ['change', 'add', 'unlink', 'addDir', 'unlinkDir']
    });
    done();
};

/**
 * Create group concat config where folder it's js file included all folder files
 *
 * @param array
 */
const jsConfig = readdirSync(config.jsDir, {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .reduce((acc, dirname) => {
        acc[`${dirname}.js`] = '**/lib/' + dirname + '/*.js';
        acc['main.js'] = ['**/*.js', '!**/lib/**'];
        return acc;
    }, {});
// Helper function to allow browser reload with Gulp 4.
const reload = done => {
    browserSync.reload();
    done();
};

/**
 * Custom Error Handler.
 *
 * @param err
 */
const errorHandler = err => {
    notify.onError('\n\n❌  ===> ERROR: <%= error.message %>\n')(err);
    beep();
};

/**
 * Task: `styles`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
gulp.task('styles', () => gulp
    .src(config.styleSRC, {allowEmpty: true})
    .pipe(plumber(errorHandler))
    .pipe(gulpif(config.isDev, sourcemaps.init()))
    .pipe(
        sass({
            errLogToConsole: config.errLogToConsole,
            outputStyle: config.outputStyle,
            precision: config.precision
        })
    )
    .on('error', sass.logError)
    .pipe(gulpif(config.isDev, sourcemaps.write({includeContent: false})))
    .pipe(gulpif(config.isDev, sourcemaps.init({loadMaps: true})))
    .pipe(autoprefixer(config.browserList))
    .pipe(gulpif(config.isDev, sourcemaps.write('./')))
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.styleDestination))
    .pipe(filter('**/*.css')) // Filtering stream to only css files.
    .pipe(mmq({log: true})) // Merge Media Queries only for .min.css version.
    .pipe(browserSync.stream()) // Reloads style.css if that is enqueued.
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.styleDestination))
    .pipe(filter('**/*.css')) // Filtering stream to only css files.
    .pipe(browserSync.stream()) // Reloads style.min.css if that is enqueued.
    .pipe(notify({message: '\n\n✅  ===> STYLES — completed!\n', onLast: true}))
);


/**
 * Task: `vendor-js`.
 *
 * Concatenate and uglify JS scripts.
 *
 * This task does the following:
 *     1. Gets the source folder for JS custom files
 *     2. Concatenates all the files and generates custom.js
 *     3. Renames the JS file with suffix .min.js
 *     4. Uglifes/Minifies the JS file and generates custom.min.js
 */
gulp.task('js', () => gulp
    .src(config.jsSRC, {since: gulp.lastRun('js')}) // Only run on changed files.
    .pipe(plumber(errorHandler))
    .pipe(
        babel({
            presets: [
                [
                    '@babel/preset-env', // Preset to compile your modern JS to ES5.
                    {
                        targets: {browsers: config.browserList} // Target browser list to support.
                    }
                ]
            ]
        })
    )
    .pipe(remember(config.jsSRC)) // Bring all files back to stream.
    .pipe(groupConcat(jsConfig))
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.jsDestination))
    .pipe(
        rename({
            suffix: '.min'
        })
    )
    .pipe(uglify())
    .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
    .pipe(gulp.dest(config.jsDestination))
    .pipe(notify({message: '\n\n✅  ===> JS — completed!\n', onLast: true}))
);

gulp.task('fonts', () => {
    return gulp
        .src(config.fontsSRC)
        .pipe(gulp.dest(config.fontsDestination))
});

/**
 * Task: `images`.
 *
 * Minifies PNG, JPEG, GIF and SVG images.
 *
 * This task does the following:
 *     1. Gets the source of images raw folder
 *     2. Minifies PNG, JPEG, GIF and SVG images
 *     3. Generates and saves the optimized images
 *
 * This task will run only once, if you want to run it
 * again, do it with the command `gulp images`.
 *
 * Read the following to change these options.
 * @link https://github.com/sindresorhus/gulp-imagemin
 */
gulp.task('images', () => gulp
    .src(config.imagesSRC)
    .pipe(
        cache(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng({optimizationLevel: 3}),
                imagemin.svgo({
                    plugins: [{removeViewBox: true}, {cleanupIDs: false}]
                })
            ])
        )
    )
    .pipe(gulp.dest(config.imagesDestination))
    .pipe(notify({message: '\n\n✅  ===> IMAGES — completed!\n', onLast: true}))
);

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */
gulp.task(
    'default',
    gulp.parallel('styles', 'js', 'fonts', 'images', browsersync, () => {
        gulp.watch(config.phpWatchFiles, reload); // Reload on PHP file changes.
        gulp.watch(config.styleWatchFiles, gulp.parallel('styles')); // Reload on SCSS file changes.
        gulp.watch(config.jsWatch, gulp.series('js', reload)); // Reload on js file changes.
        gulp.watch(config.fontsWatchFiles, gulp.series('fonts', reload)); // Reload on fonts file changes.
        gulp.watch(config.imagesWatchFiles, gulp.series('images', reload)); // Reload on images file changes.
    })
);

/**
 * Task: `clear`.
 *
 * Delete destination folder
 */
gulp.task('clear', () => gulp
    .src(config.themeDir + '/assets/', {read: false})
    .pipe(clean({force: true}))
);

/**
 * Task: `clearCache`.
 *
 * Deletes the images cache. By running the next "images" task,
 * each image will be regenerated.
 */
gulp.task('clearCache', done => cache.clearAll(done));