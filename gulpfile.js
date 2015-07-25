'use strict';

//* Присваиваем каждой переменной
//  вызов соответствующего плагина. 

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'), 
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rigger = require('gulp-rigger'),
    less = require('gulp-less'),
    minifycss = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    changed = require('gulp-changed'),
    rename = require('gulp-rename'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

//* Записываем в переменную пути к нашим файлам.

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        js_libs: 'build/js/libs/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },

    src: {
        html: 'src/*.html',
        js_main: 'src/js/main.js',
        js_plugins: 'src/js/plugins.js',
        js_libs: 'bower_components/*.js',
        styles: 'src/styles/main.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        styles: 'src/styles/**/*.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    clean: './build'
};

//* Записываем в переменную настройки локального сервера.

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 1988,
    logPrefix: "Frontend_Fellow"
};

//* Создаём задачу для HTML.

gulp.task('html:build', function () {
    gulp.src(path.src.html)                 // Выберем html файлы по нужному пути
        .pipe(changed(path.build.html))     // Получаем файлы и пропускаем только изменившиеся
        .pipe(rigger())                     // Прогоним через rigger
        .pipe(gulp.dest(path.build.html))   // Выплюнем файлы в папку build
        .pipe(reload({stream: true}));      // Перезагрузим локальный сервер
});

//* Создаём задачу для SCRIPTS.

gulp.task('js:build', function () {
    gulp.src(path.src.js_libs)              // Выберем libs файлы
        .pipe(changed(path.build.js_libs))  // Получаем файлы и пропускаем только изменившиеся
        .pipe(gulp.dest(path.build.js_libs))// Выплюнем файлы в build
    gulp.src(path.src.js_plugins)           // Выберем plugins файл
        .pipe(plumber())                    // Ловим ошибки для предотвращения остановки gulpa
        .pipe(changed(path.build.js))       // Получаем файл и пропускаем если он изменялся
        .pipe(rigger())                     // Прогоним через rigger
        .pipe(gulp.dest(path.build.js))     // Выплюнем готовый файл в build
    gulp.src(path.src.js_main)              // Выберем main файл
        .pipe(plumber())                    // Ловим ошибки для предотвращения остановки gulpa
        .pipe(rename('scripts.js'))         // Переименуем
        .pipe(gulp.dest(path.build.js))     // Выплюнем файл в build
        .pipe(reload({stream: true}));      // Перезагрузим сервер
});

//* Создаём задачу для STYLES.

gulp.task('styles:build', function () {
    gulp.src(path.src.styles)               // Выберем файл main.less
        .pipe(plumber())                    // Ловим ошибки для предотвращения остановки gulpa
        .pipe(less())                       // Компилируем через препроцессор
        .pipe(rename('styles.css'))         // Переименуем
        .pipe(autoprefixer({
            browsers: ['last 2 versions', '> 1%', 'ie 9'],
            cascade: false
        }))                                 // Добавим вендорные префиксы
        .pipe(gulp.dest(path.build.css))    // Выплюнем в build
        .pipe(minifycss())                  // Сожмём файл
        .pipe(rename({suffix: '.min'}))     // Переименуем
        .pipe(gulp.dest(path.build.css))    // Выплюнем в build
        .pipe(reload({stream: true}));      // Перезагрузим сервер
});

//* Создаём задачу для IMAGES.

gulp.task('img:build', function () {
    gulp.src(path.src.img)                  // Выберем картинки
        .pipe(changed(path.build.img))      // Получаем файлы и пропускаем только изменившиеся
        .pipe(imagemin({
            progressive: false,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))                                 // Сожмём файлы
        .pipe(gulp.dest(path.build.img))    // Выплюнем в build
        .pipe(reload({stream: true}));      // Перезагрузим сервер
});

//* Создаём задачу для FONTS.

gulp.task('fonts:build', function () {
    gulp.src(path.src.fonts)                // Выберем шрифты
        .pipe(gulp.dest(path.build.fonts))  // Выплюнем в build
});

//* Создаём задачу для очистки проекта.

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

//* Создаём задачу для инициализации
//  и запуска локального сервера.

gulp.task('localserver', function () {
    browserSync(config);
});

//* Создаём задачу для наблюдения за файлами.

gulp.task('watch', function (){
    watch([path.watch.html], function (event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.styles], function (event, cb) {
        gulp.start('styles:build');
    });
    watch([path.watch.js], function (event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function (event, cb) {
        gulp.start('img:build');
    });
    watch([path.watch.fonts], function (event, cb) {
        gulp.start('fonts:build');
    });
});

//* Создаём задачу для наблюдения за файлами
//  после сборки и запуска локального сервера.

gulp.task('watch-localserver', ['build'], function () {
    gulp.start('localserver', 'watch');
});

//* Создаём общую задачу для последовательного
//  запуска следующих задач:
//  HTML, SCRIPTS, STYLES, IMAGES, FONTS.

gulp.task('build', [
    'html:build',
    'styles:build',
    'js:build',
    'img:build',
    'fonts:build'
]);

//* Создаём задачу для пересборки проекта.

gulp.task('rebuild-project', ['clean'], function () {
    gulp.start('build');
});

//* Создаём задачу для развёртывания рабочего окружения.

gulp.task('default', ['clean'], function () {
    gulp.start('build', 'localserver', 'watch');
});
