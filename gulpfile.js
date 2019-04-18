const { task, watch, src, dest, series } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imageMin = require('gulp-imagemin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const pug = require('gulp-pug');

// Compile sass
task('sass', () => {
    return src(['src/scss/*.scss'])
        .pipe(concat('style.scss'))
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(dest('dist'))
        .pipe(browserSync.stream());
});

// Minify Images
task('images', () => {
    return src('src/images/*')
        .pipe(imageMin())
        .pipe(dest('dist/images'));
});

// Concat and Minify JS
task('js', () => {
    return src('src/js/*.js')
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('dist'));
});

// Compile pug
task('pug', () => {
    return src('src/pug/*.pug')
        .pipe(pug())
        .pipe(dest('dist'));
});

// Watch and Serve
task('serve', series('sass', 'images', 'js', 'pug', () => {
    browserSync.init({
        server: './dist'
    });
    watch(['src/scss/*.scss'], series('sass'));
    watch(['src/images/*'], series('images'));
    watch(['src/js/*.js'], series('js'));
    watch(['src/pug/*.pug'], series('pug'));
}));

// Default
task('default', series('serve'));
