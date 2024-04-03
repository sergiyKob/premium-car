const gulp = require('gulp');
// html
const fileInclude = require('gulp-file-include');
const htmlclean = require('gulp-htmlclean');
const webphtml = require('gulp-webp-html-nosvg');
// sass
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');

const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const webpCss = require('gulp-webp-css');
const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const groupMedia = require('gulp-group-css-media-queries');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const webpack = require('webpack-stream');
const babel = require('gulp-babel');
const svgSprite = require('gulp-svg-sprite');
const cheerio = require('gulp-cheerio');
const replace = require('gulp-replace');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
// images
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');
const webp = require('gulp-webp');

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

gulp.task('html:docs', function () {
    return gulp
        .src(['./src/html/**/*.html', '!./src/html/blocks/*.html'])
        .pipe(changed('./docs/'))
        .pipe(plumber(plumberNotify('HTML')))
        .pipe(fileInclude(fileIncludeSetting))
        .pipe(webphtml())
        .pipe(htmlclean())
        .pipe(gulp.dest('./docs/'));
});

gulp.task('sass:docs', function () {
    return gulp
        .src('./src/scss/*.scss')
        .pipe(changed('./docs/css/'))
        .pipe(plumber(plumberNotify('SCSS')))
        .pipe(sourceMaps.init())
        .pipe(autoprefixer())
        .pipe(sassGlob())
        .pipe(webpCss())
        .pipe(groupMedia())
        .pipe(sass())
        .pipe(csso())
        .pipe(sourceMaps.write())
        .pipe(gulp.dest('./docs/css/'));
});

gulp.task('images:docs', function () {
    return gulp
        .src('./src/img/**/*')
        .pipe(changed('./docs/img/'))
        .pipe(webp())
        .pipe(gulp.dest('./docs/img/'))
        .pipe(gulp.src('./src/img/**/*'))
        .pipe(changed('./docs/img/'))
        .pipe(imagemin({
            verbose: true
        }))
        .pipe(gulp.dest('./docs/img/'));
});

gulp.task('fonts:docs', function () {
    return gulp
        .src('./src/fonts/*.*')
        .pipe(
            fonter({
                formats: ['woff', 'ttf'],
            }),
        )
        .pipe(ttf2woff2())
        .pipe(gulp.dest('./docs/fonts/'));
});

gulp.task('files:docs', function () {
    return gulp
        .src('./src/files/**/*')
        .pipe(changed('./docs/files/'))
        .pipe(gulp.dest('./docs/files/'));
});

gulp.task('js:docs', function () {
    return gulp
        .src('./src/js/*.js')
        .pipe(changed('./docs/js/'))
        .pipe(plumber(plumberNotify('jS')))
        .pipe(babel())
        .pipe(webpack(require('../webpack.config.js')))
        .pipe(gulp.dest('./docs/js/'));
});

gulp.task('server:docs', function () {
    return gulp.src('./docs').pipe(server(serverOption));
});

gulp.task('svgSprite:docs', function () {
    return gulp
        .src('./src/img/icons/*.svg') // выбираем в папке с иконками все файлы с расширением svg
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
        .pipe(gulp.dest('./docs/img/')); // указываем, в какую папку поместить готовый файл спрайта
});

gulp.task('clean:docs', function (done) {
    if (fs.existsSync('./docs/')) {
        return gulp.src('./docs/', {
            read: false
        }).pipe(clean({
            force: true
        }));
    }
    done();
});

gulp.task('watch:docs', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:docs'));
    gulp.watch('./src/**/*.html', gulp.parallel('html:docs'));
    gulp.watch('./src/img/**/*', gulp.parallel('images:docs'));
    gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:docs'));
    gulp.watch('./src/files/**/*', gulp.parallel('files:docs'));
    gulp.watch('./src/js/**/*.js', gulp.parallel('js:docs'));
    gulp.watch('./src/img/icons/*.svg', gulp.parallel('svgSprite:docs'));
});