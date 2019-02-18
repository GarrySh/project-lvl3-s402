import gulp from 'gulp';
import stylus from 'gulp-stylus';

import { stylusConfig } from '../config';

const css = () =>
  gulp
    .src(['main.styl'], { cwd: 'src/styles' })
    .pipe(stylus(stylusConfig))
    .pipe(gulp.dest('dist/assets/stylesheets'));

export default css;
