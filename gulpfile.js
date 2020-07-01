const gulp = require("gulp");
const gulpTslint = require("gulp-tslint");
const tslint = require("tslint");
const del = require("del");
const mocha = require("gulp-mocha");
const shell = require("gulp-shell");

gulp.task("clean", function cleanTask() {
  return del([
    "lib/**",
    "definitions/**"
  ], {
    force: true
  });
});

gulp.task("build", gulp.series("clean", shell.task("tsc -p .\\/src")));

gulp.task("tslint", function tslintTask() {
  const program = tslint.Linter.createProgram("./src/tsconfig.json");
  const sources = [
    "*.ts",
    "src/**/*.ts"
  ];
  return gulp.src(sources)
    .pipe(gulpTslint({
      formatter: "verbose",
      program: program
    }))
    .pipe(gulpTslint.report());
});

gulp.task("lint", gulp.series("tslint"));

gulp.task("test", gulp.series("build", function buildTask() {
  var tests = [
    "test/*.js"
  ];
  var srcOpts = {
    read: false
  };
  return gulp.src(tests, srcOpts)
    .pipe(mocha({
      reporter: "list"
    }));
}));

gulp.task("default", gulp.series("build", function defaultTask(done) {
  return done();
}));
