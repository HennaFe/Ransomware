var encryptor = require('file-encryptor');
var fs = require('fs');

var key = 'sernande';
var folderPath = 'Items';

fs.readdir(folderPath, function(err, files) {
  if (err) {
    console.error('Error reading folder:', err);
  } else {
    files.forEach(function(file) {
      var filePath = folderPath + '/' + file;
      var encryptedFilePath = filePath + '_encrypted.dat';

      encryptor.encryptFile(filePath, encryptedFilePath, key, function(err) {
        if (err) {
          console.error('Encryption failed for file:', filePath, err);
        } else {
          console.log('Encryption complete for file:', filePath);

          fs.unlink(filePath, function(err) {
            if (err) {
              console.error('Error deleting file:', filePath, err);
            } else {
              console.log('Original file deleted:', filePath);
            }
          });
        }
      });
    });
  }
});
