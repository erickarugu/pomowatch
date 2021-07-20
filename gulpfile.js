const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();
const hashsrc = require("gulp-hash-src");
const srihash = require("gulp-sri-php");

// Sass Task
function scssTask() {
  return src('src/scss/styles.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// JavaScript Task
function jsTask() {
  return src('src/js/*.js', { sourcemaps: true })
    .pipe(terser())
    .pipe(dest('dist', { sourcemaps: '.' }));
}

// Cache bursting
function cacheBursting() {
  return src("index.html")
    .pipe(hashsrc({ build_dir: "dist", src_path: "css", exts: [".css"], verbose: true }))
    .pipe(hashsrc({ build_dir: "dist", src_path: "js", exts: [".js"], verbose: true }))
    .pipe(dest("."))
    .pipe(srihash({ "algorithm": "sha256" }))
    .pipe(dest("."));
};

// Browsersync Tasks
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch('*.html', browsersyncReload);
  watch(['src/scss/**/*.scss', 'src/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Default Gulp task
exports.default = series(
  scssTask,
  jsTask,
  browsersyncServe,
  watchTask
);