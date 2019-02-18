import gulp from 'gulp';
import { reload } from './server';
import html from './html';
import css from './css';
import scripts from './scripts';
import publicFiles from './publicFiles';

const watch = () => {
  gulp.watch(
    ['src/blocks/**/*.pug', 'src/pages/**/*.pug', 'src/layouts/**/*.pug'],
    gulp.series(html, reload)
  );
  gulp.watch(['src/blocks/**/*.styl', 'src/styles/**/*.styl'], gulp.series(css, reload));
  gulp.watch(['src/blocks/**/*.js', 'src/scripts/**/*.js'], gulp.series(scripts, reload));
  gulp.watch('src/public/**/*', gulp.series(publicFiles, reload));
};

export default watch;
