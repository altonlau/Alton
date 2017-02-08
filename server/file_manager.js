var fs = require('fs');
var grid = require('gridfs-stream');
var multer = require('multer');

var downloadFolder = './downloads';
var uploadFolder = './uploads';
var gfs, upload;

function init(mongoose) {
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      var fileExtension = file.originalname.split('.')[1];
      cb(null, file.fieldname + '-' + Date.now() + '.' + fileExtension);
    }
  });

  upload = multer({
    storage: storage
  });

  grid.mongo = mongoose.mongo;
  gfs = grid(mongoose.connection.db);
}

function deleteTempFiles() {
  var path = uploadFolder;
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      if (file !== '.gitkeep') {
        var curPath = path + '/' + file;
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
          fs.rmdirSync(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      }
    });
  }
}

function deleteFile(fileName) {
  return new Promise(function (resolve, reject) {
    var path = downloadFolder + '/' + fileName;
    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
    gfs.remove({
      filename: fileName
    }, function (error) {
      if (error) {
        reject();
      } else {
        resolve();
      }
    });
  });
}

function deleteFiles(fileNames) {
  var promises = [];

  fileNames.forEach(function (fileName) {
    promises.push(deleteFile(fileName));
  });

  if (promises) {
    return Promise.all(promises);
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function getFile(fileName) {
  return new Promise(function (resolve, reject) {
    var path = downloadFolder + '/' + fileName;
    if (fs.existsSync(path)) {
      resolve();
    } else {
      gfs.files.find({
        filename: fileName
      }).toArray(function (error, files) {
        if (error) {
          reject();
        } else {
          if (files.length > 0) {
            var readStream = gfs.createReadStream({
              filename: fileName
            });
            var writeStream = fs.createWriteStream(downloadFolder + '/' + fileName);
            readStream.pipe(writeStream);

            writeStream.on('close', function () {
              resolve();
            });
          } else {
            reject();
          }
        }
      });
    }
  });
}

function getFiles(fileNames) {
  var promises = [];
  fileNames.forEach(function (fileName) {
    promises.push(getFile(fileName));
  });

  if (promises) {
    return Promise.all(promises);
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

function saveFile(file) {
  return new Promise(function (resolve, reject) {
    var filename = file.filename;
    var path = file.path;
    var type = file.mimetype;
    var readStream = fs.createReadStream('./' + path);
    var writeStream = gfs.createWriteStream({
      filename: filename
    });

    gfs.exist({
      filename: filename
    }, function (error, found) {
      if (error) {
        reject();
      } else {
        if (found) {
          reject();
        } else {
          readStream.pipe(writeStream);
        }
      }
    });

    writeStream.on('close', function () {
      resolve();
    });
  });
}

function saveFiles(files) {
  var promises = [];

  files.forEach(function (file) {
    promises.push(saveFile(file));
  });

  if (promises) {
    return Promise.all(promises);
  } else {
    return new Promise(function (resolve, reject) {
      resolve();
    });
  }
}

module.exports = function (mongoose) {
  init(mongoose);
  return {
    multer: upload,
    clearCache: deleteTempFiles,
    delete: deleteFiles,
    get: getFiles,
    save: saveFiles
  };
};
