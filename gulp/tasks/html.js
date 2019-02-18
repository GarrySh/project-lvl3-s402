import gulp from 'gulp';
import pug from 'gulp-pug';

import { pugConfig } from '../config';

const html = () =>
  gulp
    .src(['**/*.pug'], { cwd: 'src/pages' })
    .pipe(pug(pugConfig))
    .pipe(gulp.dest('dist'));

export default html;
