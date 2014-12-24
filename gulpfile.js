var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    miniHtml = require('gulp-minify-html')
;

var env, 
    coffeeSouces,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir, 
    sassStyle;

env = process.env.NODE_ENV || 'development';

if (env==='development') {
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

sassSources = ['components/sass/style.scss'];
coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = ['components/scripts/*.js'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json']

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
        .pipe(gulpif(env === 'production' , uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function(){
    gulp.src(sassSources)
        .pipe(compass({
            sass : 'components/sass' ,
            image: outputDir + 'images' ,
            style: sassStyle
    }))
        .on('error' , gutil.log)
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('watch' , function (){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources , ['js']);
    gulp.watch('components/sass/*.scss' , ['compass']);
    gulp.watch('builds/developlment/*.html' , ['html']);
    gulp.watch(jsonSources , ['json']);
});

gulp.task('connect' , function(){
    connect.server({
        root: outputDir, 
        livereload: true
    });
});

gulp.task('html' , function(){
    gulp.src('builds/developlment/*.html')
        .pipe(gulpif( env === 'production', miniHtml()))
        .pipe(gulpif( env === 'production', gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('json' , function(){
    gulp.src(jsonSources)
        .pipe(connect.reload())
});

gulp.task('default' , ['coffee', 'js' , 'compass', 'connect' , 'html', 'json' ,'watch' ]);
