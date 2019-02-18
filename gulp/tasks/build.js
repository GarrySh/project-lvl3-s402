import gulp from 'gulp';

import clean from './clean';
import scripts from './scripts';

export default gulp.series(clean, scripts);
