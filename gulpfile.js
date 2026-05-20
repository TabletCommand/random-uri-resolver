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

gulp.task("test", exec.task("tsx --test --test-reporter=spec src/test/*.ts"));

gulp.task("spell", exec.task("cspell --no-progress"));

gulp.task("type-coverage", exec.task("type-coverage --detail"));

gulp.task("default", gulp.series("spell", "type-coverage", "lint", "build", "test"));
