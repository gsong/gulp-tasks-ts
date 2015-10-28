declare let $;

import * as fs from "fs";
import * as path from "path";

import * as runSequence from "run-sequence";
import Builder from "systemjs-builder";
import gulpLoadPlugins = require("gulp-load-plugins");

import "./clean";
import "./script";
import "./style";
import "./utils";
import * as paths from "./paths";
import gulp from "./_gulp";


$ = gulpLoadPlugins();


export function makeSettings(environments) {
  gulp.task("build:make-settings", () => {
    const env = process.env.ENV || "development";
    const outfile = paths.SETTINGS;
    const settings = environments[env];
    $.util.log(settings);

    return fs.writeFileSync(outfile,
  `// Auto generated by gulp task
  // Do **not** modify manually unless you know what you"re doing
  /* tslint:disable */
  const settings = Object.freeze(${JSON.stringify(settings)});
  export default settings;`);
  });
}


gulp.task("build:jspm", ["compile:styles", "js:lint"], (cb) => {
  const builder = new Builder(
    paths.TMP_DIR, path.join(paths.TMP_DIR, "config.js")
  );
  return builder.buildStatic(
    paths.INDEX_SCRIPT, paths.BUILD_INDEX_JS, {runtime: true}
  )
  .catch((err) => cb(err));
});


gulp.task("build:js", (callback) => runSequence(
  "build:jspm", "js:replace_paths", callback
));


gulp.task("build:html", () => gulp.src(paths.SRC_INDEX_HTML)
  .pipe($.htmlReplace({"js": paths.INDEX_SCRIPT}))
  .pipe(gulp.dest(paths.BUILD_DIR))
);


gulp.task("build:images", () => gulp.src(paths.TMP_IMAGE)
  .pipe($.imagemin({
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest(paths.BUILD_DIR))
);


gulp.task("build", (callback) => runSequence(
  ["clean:build", "build:make-settings", "utils:copy_to_tmp"],
  ["build:js", "build:html", "build:images"],
  callback
));
