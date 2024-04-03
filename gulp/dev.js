const gulp = require('gulp');
// html
const fileInclude = require('gulp-file-include');
// sass
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');

const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const plumberNotify = (title) => {
    return {
        errorHandler: notify.onError({
            title: 'HTML',
            message: 'Error <%= error.message %>',
            sound: false,
        }),
    };
};
const fileIncludeSetting = {
    prefix: '@@',
    basepath: '@file',
};
const serverOption = {
    livereload: true,
    open: true,
};

gulp.task('html:dev', function () {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./build/', {
            hasChanged: changed.compareContents
        }))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(gulp.dest('./build/'));
});

gulp.task('sass:dev', function () {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./build/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(sassGlob())
        .pipe(sass())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./build/css/'));
});

gulp.task('images:dev', function () {
    return gulp.src('./src/img/**/*')
        .pipe(changed('./build/img/'))
        .pipe(gulp.dest('./build/img/'));
});

gulp.task('fonts:dev', function () {
    return gulp
        .src('./src/fonts/*.*')
        .pipe(
            fonter({
                formats: ['woff', 'ttf'],
            }),
        )
        .pipe(ttf2woff2())
        .pipe(gulp.dest('./build/fonts/'));
});

gulp.task('files:dev', function () {
    return gulp
        .src('./src/files/**/*')
        .pipe(changed('./build/files/'))
        .pipe(gulp.dest('./build/files/'));
});

gulp.task('js:dev', function () {
    return gulp
        .src('./src/js/*.js')
        .pipe(changed('./build/js/'))
        .pipe(plumber(plumberNotify('jS')))
        .pipe(webpack(require('./../webpack.config.js')))
        .pipe(gulp.dest('./build/js/'))
});

gulp.task('server:dev', function () {
    return gulp.src('./build').pipe(server(serverOption));
});

gulp.task('svgSprite:dev', function () {
    return gulp
        .src('./src/img/icons/**/*.svg') // выбираем в папке с иконками все файлы с расширением svg
        .pipe(
            cheerio({
                run: ($) => {
                    $('[fill]').removeAttr('fill'); // очищаем цвет у иконок по умолчанию, чтобы можно было задать свой
                    $('[stroke]').removeAttr('stroke'); // очищаем, если есть лишние атрибуты строк
                    $('[style]').removeAttr('style'); // убираем внутренние стили для иконок
                },
                parserOptions: {
                    xmlMode: true
                },
            }),
        )
        .pipe(replace('&gt;', '>')) // боремся с заменой символа
        .pipe(
            svgSprite({
                mode: {
                    stack: {
                        sprite: '../sprite.svg', // указываем имя файла спрайта и путь
                    },
                },
            }),
        )
        .pipe(gulp.dest('./build/img/')); // указываем, в какую папку поместить готовый файл спрайта
});

gulp.task('clean:dev', function (done) {
    if (fs.existsSync('./build/')) {
        return gulp.src('./build/', {
            read: false
        }).pipe(clean({
            force: true
        }));
    }
    done();
});

gulp.task('watch:dev', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:dev'));
    gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
    gulp.watch('./src/img/icons/*.svg', gulp.parallel('svgSprite:dev'));
});