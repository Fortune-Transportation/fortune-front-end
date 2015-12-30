var gulp = require('gulp'),
    del = require('del'),
    open = require('open'),
    karma = require('karma'),
    child_process = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    $ = require('gulp-load-plugins')();

gulp.task('clean', () => {
   return del("dist/**/*"); 
});

gulp.task('build', ['clean'], () => {
    var jsFilter = $.filter('**/*.js', {restore:true}),
        jadeFilter = $.filter('**/*.jade', {restore:true}),
        scssFilter = $.filter('**/*.scss', {restore:true}),
        injectFilter = $.filter(['**/*.css', '**/*.js', '**/index.html', '!**/*.map'], {restore:true}),
        excludeSpecFilter = $.filter('!**/*.spec.js');
    
    return gulp.src('app/**/*')
        .pipe(excludeSpecFilter)
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
    return gulp.watch('app/**/*', ['rebuild']);
});

gulp.task('rebuild', ['clean', 'build'], () => {
    gulp.src('dist/**/*.html')
        .pipe($.connect.reload());
});

gulp.task('default', ['build', 'serve', 'watch']);

gulp.task('test:unit', done => {
    new karma.Server({
        configFile: `${__dirname}/karma.conf.js`
    }, done).start();
});

gulp.task('protractor-install', done => {
    child_process
        .spawn('node', ['node_modules/protractor/bin/webdriver-manager', 'update'], {stdio: 'inherit'})
        .on('close', () => {
            fs.readdir('node_modules/protractor/selenium', (e, files) => {
                if(e) {
                    throw e;
                } else {
                    var jarFile;
                    for(var file of files) {
                        if(path.extname(file) === '.jar') {
                            jarFile = `node_modules/protractor/selenium/${file}`;
                        }
                    }
                    if(jarFile) {
                        gulp.src('protractor.conf.js')
                            .pipe($.replace(/seleniumServerJar:.*,/, `seleniumServerJar: "${jarFile}",`))
                            .pipe(gulp.dest('.'))
                            .on('end', () => {
                                done();
                            });
                    } else {
                        done();
                    }
                }
            });
        });
});

gulp.task('test:e2e', ['protractor-install', 'build'], done => {
    child_process
        .spawn('node', ['node_modules/protractor/bin/protractor'], {stdio: 'inherit'})
        .once('close', done);
});

gulp.task('test', ['test:unit', 'test:e2e']);