var gulp = require('gulp'),
  jade = require('gulp-jade'),
  sass = require('gulp-sass'),
  babel = require('gulp-babel'),
  uglify = require('gulp-uglify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  sourcemaps = require('gulp-sourcemaps'),
  changed = require('gulp-changed'),
  gutil = require('gulp-util'),
  autoPrefix = require('gulp-autoprefixer'),
  browserify = require('browserify'),
  browserSync = require('browser-sync').create()

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './public'
    },
    files: ['public/**/**.*'],
    open: false
  })
})

gulp.task('watch', ['jade', 'sass', 'js'], ()=>{
  gulp.watch('./src/*.jade', ['jade'])
  gulp.watch('./src/sass/**/*.scss', ['sass'])
  gulp.watch('./src/js/**/*.js', ['js'])
})

gulp.task('jade', () => {
  return gulp.src('./src/*.jade')
    .pipe(changed('./public/'))
    .pipe(jade({ pretty: true }))
    .pipe(gulp.dest('./public/'))
})

gulp.task('sass', () => {
  return gulp.src('./src/sass/custom.scss')
    .pipe(changed('./public/css/'))
    .pipe(sass().on('error', gutil.log))
    .pipe(autoPrefix())
    .pipe(gulp.dest('./public/css/'))
})

gulp.task('js', () => {
  let b = browserify({
    entries: './src/js/app.js',
    debug: true
  })

  return b.bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js/'))
})