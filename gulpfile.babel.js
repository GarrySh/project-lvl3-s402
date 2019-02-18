import gulp from 'gulp';
import build from './gulp/tasks/build';
import deploy from './gulp/tasks/deploy';

gulp.task('build', build);
gulp.task('deploy', deploy);

gulp.task('default', gulp.series('build'));
