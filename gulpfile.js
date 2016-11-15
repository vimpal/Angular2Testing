var gulp = require('gulp');
var args   = require('yargs').argv;
var gulpif = require('gulp-if');
var rubysass = require('gulp-ruby-sass');
var nodesass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var fs = require('fs');
var notify = require('gulp-notify');
var lr = require('tiny-lr');
var system = require('system');
var builder = require('systemjs-builder');
global.System = builder.loader;
var server = lr();

var scssFiles = './sass/**/*.scss';
var cssCompileDir = './css';
var sassLoadPaths = [
    './bower_components/bootstrap-sass-official/assets/stylesheets'
];
var fastSass = args.fast === true;

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
}

gulp.task('styles', function () {
    gulp.src(scssFiles)
        .pipe(gulpif(!fastSass, sass({
            sourcemap: true,
            precision: 10,
            loadPath: sassLoadPaths
        }).on('error', handleError)))
        .pipe(gulpif(fastSass, nodesass({
            errLogToConsole: true,
            includePaths: sassLoadPaths
        })))
        .pipe(prefix("last 1 version", "> 1%", "ie 8"))
        .pipe(minifycss())
        .pipe(gulp.dest(cssCompileDir))
        .pipe(livereload(server))
        .pipe(notify({ message: 'SASS/Sourcemap compiled'}));
});

gulp.task('watch', ['build'], function() {
    server.listen(35729, function (err) {
        if (err) {
            throw err;
        }
    });

    gulp.watch(scssFiles, ['styles']);
});

gulp.task('build', ['styles']);
