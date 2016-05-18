/* jshint node: true */

"use strict";

var gulp = require("gulp");
var purescript = require("gulp-purescript");
var less = require("gulp-less");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var rimraf = require("rimraf");
var obfuscate = require('gulp-obfuscate');
var webserver = require('gulp-webserver');

var sources = [
    "src/**/*.purs",
    "bower_components/purescript-*/src/**/*.purs"
];

var foreigns = [
    "src/Foreign/*.js",
    "bower_components/purescript-*/src/**/*.js"
];

var sourcesCli = [
    "bower_components/purescript-*/src/**/*.purs",
    "src/Types.purs",
    "src/Helper.purs",
    "src/Unsafe.purs"
];

gulp.task("clean-docs", function(cb) {
    rimraf("docs", cb);
});

gulp.task("clean-dist", function(cb) {
    rimraf("dist", cb);
});

gulp.task("clean", ["clean-docs", "clean-dist"]);

gulp.task("psc", function() {
    return purescript.psc({
            src: sources,
            ffi: foreigns,
            output: "output/main"
        });
});

gulp.task("bundle", ["psc"], function() {
    return purescript.pscBundle({
            src: "output/main/**/*.js",
            output: "dist/mainps.js",
            module: "Main",
            main: "Main"
        });
});

gulp.task("psci", function () {
    return purescript.psci({
            src: sourcesCli,
            ffi: foreigns
        })
        .pipe(gulp.dest("."));
});

gulp.task("less", function() {
    return gulp.src("css/*.less")
        .pipe(less({}))
        .pipe(gulp.dest("dist"));
});

gulp.task("concat", ["bundle"], function() {
    return gulp.src([
        "bower_components/isomer/dist/isomer.min.js",
        "dist/mainps.js",
	"js/Util.js",
	"js/Config.js",
	"js/Sempre.js",
	"js/GameLogic.js",
	"js/GameSetup.js"
        ])
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("concatdebug", ["bundle"], function() {
    return gulp.src([
        "bower_components/isomer/dist/isomer.min.js",
        "dist/mainps.js",
	"js/Util.js",
	"js/Config.js",
	"js/Debug.js",
	"js/Sempre.js",
	"js/GameLogic.js",
	"js/GameSetup.js"
        ])
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("concatturk", ["bundle"], function() {
    return gulp.src([
        "bower_components/isomer/dist/isomer.min.js",
        "dist/mainps.js",
	"js/underscore.js",
	"js/Util.js",
	"js/TurkConfig.js",
	"js/Sempre.js",
	"js/GameLogic.js",
	"js/Turk.js",
	"js/GameSetup.js",
        ])
        .pipe(concat("main.js"))
        .pipe(gulp.dest("dist"));
});

gulp.task("compress", ["concat"], function() {
    return gulp.src("dist/main.js")
        .pipe(uglify().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest("dist"));
});

gulp.task('obfuscate', ["compress"], function () {
    return gulp.src("dist/main.js")
        .pipe(obfuscate().on('error', function(e){
            console.log(e);
         }))
        .pipe(gulp.dest("dist"));
});

gulp.task("docs", ["clean-docs"], function () {
    return purescript.pscDocs({
            src: sources,
            docgen: {
                "DOMHelper": "docs/DOMHelper.md",
                "Helper": "docs/Helper.md",
                "Isomer": "docs/Isomer.md",
                "Types": "docs/Types.md",
		"Unsafe": "docs/Unsafe.md"
            }
        });
});

gulp.task("webserver", function() {
    return gulp.src('./')
    .pipe(webserver({
     livereload: {
        enable: false,
        filter: function(fileName) {
          if (fileName.match(/(examples)|(logs)/)) {
            return false;
          } else {
            return true;
          }
        }
      },
	port: 8000,

    }));
});

gulp.task("prod", ["clean", "less", "psci", "bundle", "concat", "compress", "docs"]);
gulp.task("dev", ["less", "psci", "bundle", "concat"]);
gulp.task("debug", ["less", "psci", "bundle", "concatdebug"]);
gulp.task("turk", ["less", "psci", "bundle", "concatturk", "compress"]);
gulp.task("default", ["less", "psci", "bundle", "concat"]);
gulp.task("serve", ["dev", "webserver"]);
gulp.task("servedebug", ["debug", "webserver"]);
