var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat')
    compass = require('gulp-compass')
;

var sassSources = ['components/sass/style.scss'];
var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = ['components/scripts/*.js'];

gulp.task('log', function(){
    gutil.log('Workflows are awesom');

});

gulp.task('coffee', function(){
    gulp.src(coffeeSources)
        .pipe( coffee({bare: true})
             .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
    
});

gulp.task('js', function(){
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'))
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass : 'components/sass' ,
            image: 'builds/development/images' ,
            style: 'expanded'
    }))
        .on('error' , gutil.log)
        .pipe(gulp.dest('builds/development/css'))
});

gulp.task('default' , ['coffee', 'js' , 'compass' ]);
