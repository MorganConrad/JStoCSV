// based on https://github.com/coryasilva/csv-spectrum/blob/master/index.js

var fs = require('fs')
var path = require('path')

function doRead(folders, options = {}) {
  let dirs = {};
  for (let folder of folders) {
    let fileList = fs.readdirSync(path.join(__dirname, folder));
    let folderList = {};
    fileList.forEach((f) =>  {
      let fullPath = path.join(__dirname, folder, f);
      let id = path.basename(f, path.extname(f));
      folderList[id] = { path: fullPath };
      if (options.readSync) {
        folderList[id].data = fs.readFileSync(fullPath);
      }
    });
    dirs[folder] = folderList;
  }

  return dirs;
}

function readDirs(...folders) {
  return doRead(folders);
}

function readFilesSync(...folders) {
  return doRead(folders, { readSync: true });
}

let foo = readDirs('./testData/csv');
console.dir(foo);
