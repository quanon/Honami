import glob from 'glob';
import gulp from 'gulp';
import sass from 'gulp-sass';
import jade from 'gulp-jade';
import del from 'del';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import runSequence from 'run-sequence';

function handleError(error) {
  console.log(error.message);
  this.emit('end');
}

gulp.task('build:clean', () => {
	return del(['app/**/*.*']);
});

gulp.task('build:javascript:boot', () => {
  return browserify({
    entries: ['src/boot.js'],
    debug: true,
    // (参考) browserify bundle electron app main process file
    // https://stackoverflow.com/questions/33846090/browserify-bundle-electron-app-main-process-file
    ignoreMissing: true,
    detectGlobals: false
  })
    .transform('babelify')
    .bundle()
    .on('error', handleError)
    .pipe(source('boot.js'))
    .pipe(gulp.dest('app'));
});

gulp.task('build:javascript:app', () => {
  return browserify({
    entries: glob.sync('src/javascripts/**/*.js'),
    debug: true,
    ignoreMissing: true
  })
    .transform('babelify')
    .bundle()
    .on('error', handleError)
    .pipe(source('app.js'))
    .pipe(gulp.dest('app/javascripts'));
});

gulp.task('build:javascript', [
  'build:javascript:boot',
  'build:javascript:app'
]);

gulp.task('build:font', () => {
  return gulp
    .src('src/fonts/**/*.{eot,svg,ttf,woff}')
    .pipe(gulp.dest('app/fonts'));
});

gulp.task('build:sass', () => {
  return gulp
    .src('src/stylesheets/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/stylesheets'));
});

gulp.task('build:jade', () => {
  return gulp
    .src('src/index.jade')
    .pipe(jade())
    .pipe(gulp.dest('app'));
});

gulp.task('build', () => {
  runSequence(
    'build:clean',
    'build:font',
    ['build:sass', 'build:javascript'],
    'build:jade'
  );
});
