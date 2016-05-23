/* jshint node: true */

"use strict";

var gulp = require("gulp");
var purescript = require("gulp-purescript");
var less = require("gulp-less");
var uglify = require("gulp-uglify");
var concat = require("gulp-concat");
var concat = require("gulp-concat");
var obfuscate = require('gulp-obfuscate');
var webserver = require('gulp-webserver');
var rimraf = require('rimraf');

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

gulp.task("clean-dist", function(cb) {
    rimraf("dist", cb);
});

gulp.task("clean", ["clean-dist"]);

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
  return gulp.src(["css/awesomplete.css", "css/*.less"])
        .pipe(less({})).pipe(concat("main.css"))
        .pipe(gulp.dest("dist"));
});

gulp.task("concat", ["bundle"], function() {
    return gulp.src([
        "bower_components/isomer/dist/isomer.min.js",
        "js/underscore.js",
        "js/awesomplete.js",
        "dist/mainps.js",
        "js/Config.js",
	"js/Util.js",
	"js/Sempre.js",
        "js/GameLogic.js",
        "js/Tutorial.js",
        "js/Turk.js"
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

gulp.task("turk", ["less", "psci", "bundle", "concat", "compress"]);
gulp.task("default", ["less", "psci", "bundle", "concat"]);
gulp.task("serve", ["default", "webserver"]);
gulp.task("servet", ["turk", "webserver"]);
