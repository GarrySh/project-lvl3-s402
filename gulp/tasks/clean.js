import del from 'del';
import { delConfig } from '../config';

export default done =>
  del(delConfig).then(paths => {
    console.log('Deleted files and folders:\n', paths.join('\n'));
    done();
  });
