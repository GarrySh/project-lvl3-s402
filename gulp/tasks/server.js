import browserSync from 'browser-sync';
import { browserSyncConfig } from '../config';

export default () => browserSync.init(browserSyncConfig);

export const reload = done => {
  browserSync.reload();
  done();
};
