import _ from 'underscore';
import path from 'path';
import remote from 'remote';

const fs = remote.require('fs');

const getFilepathsInDir = (dirpath) => {
  return _.reduce(
    fs.readdirSync(dirpath),
    (filepaths, filename) => {
      const filepath = path.join(dirpath, filename);
      const stat = fs.statSync(filepath);
      if (stat.isFile()) {
        filepaths.push(filepath);
      }

      return filepaths;
    }, []);
};

export default {
  flattenFilepaths(filepaths) {
    return _.reduce(filepaths, (flattenedFilepaths, filepath) => {
      const stat = fs.statSync(filepath);
      if (stat.isDirectory()) {
        const filepathsInDir = getFilepathsInDir(filepath);
        Array.prototype.push.apply(flattenedFilepaths, filepathsInDir);
      } else if (stat.isFile()) {
        flattenedFilepaths.push(filepath);
      }

      return flattenedFilepaths;
    }, [])
      .sort();
  }
};
