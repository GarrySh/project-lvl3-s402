import gulp from 'gulp';

import clean from './clean';
import html from './html';
import css from './css';
import scripts from './scripts';
import publicFiles from './publicFiles';

export default gulp.series(clean, gulp.parallel(html, css, scripts, publicFiles));
