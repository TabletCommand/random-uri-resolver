const gulp = require("gulp");
const exec = require("gulp-execa");
const { deleteAsync } = require("del");

gulp.task("clean", function cleanTask() {
  return deleteAsync([
    "lib/**",
    "!lib",
    "definitions/**",
    "!definitions"
  ], {
    force: true
  });
});

gulp.task("build", gulp.series("clean", exec.task("tsc -p src")));

gulp.task("lint", gulp.series(exec.task("eslint src")));

gulp.task("test", exec.task("mocha --reporter list --recursive test"));

gulp.task("default", gulp.series("build", function defaultTask(done) {
  return done();
}));
