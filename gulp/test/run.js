var mocha = require('gulp-mocha')
var gulp = require('gulp')
var babelregister = require('babel/register');

var argv = require('yargs').argv

gulp.task('test', function() {
    return gulp.src('test/examples.test.js', {
            read: false
        })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            compilers: {js: babelregister},
            grep: argv.g
        }))
})

gulp.task('test:viz', ['test:generate'], function() {
    return gulp.src('test/examples.test.js', {
            read: false
        })
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({
            compilers: {js: babelregister},
            grep: argv.g,
            reporter: require('../../test/reporter')
        }))
})

gulp.task('test:run', ['test:generate', 'test'])
