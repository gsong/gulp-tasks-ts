declare let $;

import * as vinylPaths from "vinyl-paths";
import gulpLoadPlugins = require("gulp-load-plugins");

import * as paths from "./paths";
import gulp from "./_gulp";


$ = gulpLoadPlugins();


gulp.task("compile:styles", () => {
  // See https://github.com/ai/browserslist for more details on how to set
  // browser versions
  const AUTOPREFIXER_BROWSERS = ["last 2 versions"];

  return gulp.src(paths.SRC_STYLE)
  .pipe($.changed(paths.TMP_DIR, {extension: ".css"}))
  .pipe(vinylPaths((paths) => {
    $.util.log(`Compiling ${paths}…`);
    return Promise.resolve();
  }))
  .pipe($.sass({outputStyle: "compressed"}).on("error", $.sass.logError))
  .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
  .pipe(gulp.dest(paths.TMP_DIR));
});
