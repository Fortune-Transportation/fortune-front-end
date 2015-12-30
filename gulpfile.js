var gulp = require('gulp'),
    del = require('del'),
    open = require('open'),
    $ = require('gulp-load-plugins')();

gulp.task('clean', () => {
   return del("dist/**/*"); 
});

gulp.task('build', ['clean'], () => {
    var jsFilter = $.filter('**/*.js', {restore:true}),
        jadeFilter = $.filter('**/*.jade', {restore:true}),
        scssFilter = $.filter('**/*.scss', {restore:true}),
        injectFilter = $.filter(['**/*.css', '**/*.js', '**/index.html', '!**/*.map'], {restore:true});
    
    return gulp.src('app/**/*')
        .pipe(scssFilter)
            .pipe($.sourcemaps.init())
                .pipe($.sass())
                .pipe($.concat('app.min.css'))
                .pipe($.autoprefixer())
                .pipe($.cssnano())
                .pipe($.rev())
            .pipe($.sourcemaps.write('maps'))
        .pipe(scssFilter.restore)
        .pipe(jsFilter)
            .pipe($.sourcemaps.init())
                .pipe($.concat('app.min.js'))
                .pipe($.uglify())
                .pipe($.rev())
            .pipe($.sourcemaps.write('maps'))
        .pipe(jsFilter.restore)
        .pipe(jadeFilter)
            .pipe($.jade())
        .pipe(jadeFilter.restore)
        .pipe(injectFilter)
            .pipe($.simpleInject({cwd: 'app'}))
        .pipe(injectFilter.restore)
        .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['build'], () => {
    $.connect.server({
        root: 'dist',
        livereload: true
    });
    open('http://localhost:8080');
});

gulp.task('watch', () => {
    gulp.watch('app/**/*', ['rebuild']);
});

gulp.task('rebuild', ['clean', 'build'], () => {
    gulp.src('dist/**/*.html')
        .pipe($.connect.reload());
});

gulp.task('default', ['build', 'serve', 'watch']);