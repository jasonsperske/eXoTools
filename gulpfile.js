const gulp = require('gulp')
const uglify = require('gulp-uglify')
const sass = require('gulp-sass')
const cleanCSS = require('gulp-clean-css')
const flatten = require('gulp-flatten')
const concat = require('gulp-concat')
const rename = require('gulp-rename')

function javascript() {
  return gulp.src(['node_modules/materialize-css/dist/js/materialize.js'],
  { base: '.' })
    .pipe(uglify())
    .pipe(concat('view.min.js'))
    .pipe(gulp.dest('src/views/js/'))
}

function css() {
  return gulp.src('src/view.scss')
    .pipe(sass({paths: [ '.' ]}))
    .pipe(cleanCSS())
    .pipe(rename('view.min.css'))
    .pipe(gulp.dest('src/views/style/'))
}

exports.default = gulp.series(javascript, css)
