import gulp from 'gulp';

const publicFiles = () => gulp.src('**/{*,.*}', { cwd: 'src/public' }).pipe(gulp.dest('dist'));

export default publicFiles;
