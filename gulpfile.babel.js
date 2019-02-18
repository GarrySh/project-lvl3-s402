import gulp from 'gulp';
import build from './gulp/tasks/build';
import dev from './gulp/tasks/dev';
import deploy from './gulp/tasks/deploy';

gulp.task('build', build);
gulp.task('dev', dev);
gulp.task('deploy', deploy);

gulp.task('default', gulp.series('build'));
