const path = require('path');
const findParentDir = require('find-parent-dir');
const fs = require('fs');

function resolve(targetUrl, source) {
  const packageRoot = findParentDir.sync(source, 'node_modules');

  if (!packageRoot) {
    return null;
  }

  const filePath = path.resolve(packageRoot, 'node_modules', targetUrl);

  // @import '~my-module/my-file' where there is a '~/my-module/_my-file.scss'
  const parts = path.parse(filePath);
  const partialPath = path.join(parts.dir, '_' + parts.name);
  if (fs.existsSync(partialPath + '.scss')) {
    return partialPath;
  }

  // @import '~my-module/my-file' where there is a '~/my-module/my-file.scss'
  if (fs.existsSync(filePath + '.scss')) {
    return filePath;
  }

  // @import '~my-module/my-file' where there is a '~/my-module/my-file.css'
  if (fs.existsSync(filePath + '.css')) {
    return filePath;
  }

  // @import '~my-module/my-file.scss'
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  return resolve(targetUrl, path.dirname(packageRoot));
}

module.exports = function importer(url, prev, done) {
  return url[0] === '~' ? { file: resolve(url.substr(1), prev) } : null;
};
