import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpackConfig from '../../webpack.config.babel';

const scripts = () =>
  gulp
    .src(['*.js', '!_*.js'], { cwd: 'src' })
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('dist'));

export default scripts;
