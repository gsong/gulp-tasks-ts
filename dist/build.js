var fs = require("fs");
var path = require("path");
var runSequence = require("run-sequence");
var systemjs_builder_1 = require("systemjs-builder");
var gulpLoadPlugins = require("gulp-load-plugins");
require("./clean");
require("./script");
require("./style");
require("./utils");
var paths = require("./paths");
var _gulp_1 = require("./_gulp");
$ = gulpLoadPlugins();
function makeSettings(environments) {
    _gulp_1.default.task("build:make-settings", function () {
        var env = process.env.ENV || "development";
        var outfile = paths.SETTINGS;
        var settings = environments[env];
        $.util.log(settings);
        return fs.writeFileSync(outfile, "// Auto generated by gulp task\n  // Do **not** modify manually unless you know what you\"re doing\n  /* tslint:disable */\n  const settings = Object.freeze(" + JSON.stringify(settings) + ");\n  export default settings;");
    });
}
exports.makeSettings = makeSettings;
_gulp_1.default.task("build:jspm", ["compile:styles", "js:lint"], function (cb) {
    var builder = new systemjs_builder_1.default(paths.TMP_DIR, path.join(paths.TMP_DIR, "config.js"));
    return builder.buildStatic(paths.INDEX_SCRIPT, paths.BUILD_INDEX_JS, { runtime: true })
        .catch(function (err) { return cb(err); });
});
_gulp_1.default.task("build:js", function (callback) { return runSequence("build:jspm", "js:replace_paths", callback); });
_gulp_1.default.task("build:html", function () { return _gulp_1.default.src(paths.SRC_INDEX_HTML)
    .pipe($.htmlReplace({ "js": paths.INDEX_SCRIPT }))
    .pipe(_gulp_1.default.dest(paths.BUILD_DIR)); });
_gulp_1.default.task("build:images", function () { return _gulp_1.default.src(paths.TMP_IMAGE)
    .pipe($.imagemin({
    progressive: true,
    interlaced: true
}))
    .pipe(_gulp_1.default.dest(paths.BUILD_DIR)); });
_gulp_1.default.task("build", function (callback) { return runSequence(["clean:build", "build:make-settings", "utils:copy_to_tmp"], ["build:js", "build:html", "build:images"], callback); });
