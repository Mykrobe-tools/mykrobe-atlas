// adapted from:
// https://github.com/23/resumable.js/blob/master/samples/Node.js/resumable-node.js
//
// checksum-checking logic added

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

var uploadDirectory;
var maxFileSize = null;
var fileParameterName = 'file';

// set local upload directory
function setUploadDirectory(uploadDir) {
  uploadDirectory = uploadDir;
  try {
    fs.mkdirSync(uploadDirectory);
  } catch (e) {
    // console.log(e);
  }
}

// handle get requests
function get(req) {
  var chunkNumber = req.query.resumableChunkNumber || 0;
  var chunkSize = req.query.resumableChunkSize || 0;
  var totalSize = req.query.resumableTotalSize || 0;
  var identifier = req.query.resumableIdentifier || '';
  var filename = req.query.resumableFilename || '';
  var checksum = req.query.checksum || '';

  var chunkFilename = getChunkFilename(chunkNumber, identifier);

  var status = {
    valid: true,
    message: null,
    filename: chunkFilename,
    originalFilename: filename,
    identifier: identifier,
  };

  var validation = validateRequest(
    chunkNumber,
    chunkSize,
    totalSize,
    identifier,
    filename
  );
  if (!validation.valid) {
    status.valid = validation.valid;
    status.message = validation.message;
    return status;
  }

  if (!fs.existsSync(chunkFilename)) {
    status.valid = false;
    status.message = `Chunk ${chunkNumber} not uploaded yet`;
    return status;
  }

  var validChecksum = validateChecksum(chunkFilename, checksum);
  if (!validChecksum) {
    status.valid = false;
    status.message = "Uploaded file checksum doesn't match original checksum";
    return status;
  }

  return status;
}

// handle post requests
function post(req) {
  var fields = req.body;
  var files = req.files;

  var chunkNumber = fields.resumableChunkNumber;
  var chunkSize = fields.resumableChunkSize;
  var totalSize = fields.resumableTotalSize;
  var identifier = cleanIdentifier(fields.resumableIdentifier);
  var filename = fields.resumableFilename;
  var originalFilename = fields.resumableIdentifier;
  var checksum = fields.checksum;

  var chunkFilename = getChunkFilename(chunkNumber, identifier);

  var status = {
    complete: false,
    message: null,
    filename: filename,
    originalFilename: originalFilename,
    identifier: identifier,
  };

  if (!files[fileParameterName] || !files[fileParameterName].size) {
    status.message = 'Invalid resumable request';
    return status;
  }

  var validation = validateRequest(
    chunkNumber,
    chunkSize,
    totalSize,
    identifier,
    files[fileParameterName].size
  );
  if (!validation.valid) {
    status.message = validation.message;
    return status;
  }

  var validChecksum = validateChecksum(files[fileParameterName].path, checksum);
  if (!validChecksum) {
    status.message = "Uploaded file checksum doesn't match original checksum";
    return status;
  }

  // save uploaded chunk to disk
  fs.renameSync(files[fileParameterName].path, chunkFilename);
  status.message = `Chunk ${chunkNumber} uploaded`;

  var currentTestChunk = 1;
  var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1.0)), 1);

  function testForUploadCompletion() {
    var fileName = getChunkFilename(currentTestChunk, identifier);
    var fileExists = fs.existsSync(fileName);
    if (fileExists) {
      currentTestChunk++;
      if (currentTestChunk > numberOfChunks) {
        status.complete = true;
        return status;
      } else {
        return testForUploadCompletion();
      }
    } else {
      return status;
    }
  }
  return testForUploadCompletion();
}

function cleanIdentifier(identifier) {
  return identifier.replace(/^0-9A-Za-z_-/gim, '');
}

function getChunkFilename(chunkNumber, identifier) {
  identifier = cleanIdentifier(identifier);
  return path.join(uploadDirectory, `./resumable-${identifier}.${chunkNumber}`);
}

function validateRequest(
  chunkNumber,
  chunkSize,
  totalSize,
  identifier,
  filename,
  fileSize
) {
  identifier = cleanIdentifier(identifier);

  var validation = {
    valid: true,
    message: null,
  };

  // Validation: Check if the request is sane
  if (
    chunkNumber === 0 ||
    chunkSize === 0 ||
    totalSize === 0 ||
    identifier.length === 0 ||
    filename.length === 0
  ) {
    validation.valid = false;
    validation.message = 'Non-resumable request';
    return validation;
  }

  // Validation: Incorrect chunk number
  var numberOfChunks = Math.max(Math.floor(totalSize / (chunkSize * 1)), 1);
  if (chunkNumber > numberOfChunks) {
    validation.valid = false;
    validation.message = 'Incorrect chunk number';
    return validation;
  }

  // Validation: Is the file too big?
  if (maxFileSize && totalSize > maxFileSize) {
    validation.valid = false;
    validation.message = 'File is larger than max file size';
    return validation;
  }

  if (typeof fileSize !== 'undefined') {
    // Validation: The chunk in the POST request isn't the correct size
    if (chunkNumber < numberOfChunks && fileSize !== chunkSize) {
      validation.valid = false;
      validation.message = 'Incorrect chunk size';
      return validation;
    }

    // Validation: The chunks in the POST is the last one, and the fil is not the correct size
    if (
      numberOfChunks > 1 &&
      chunkNumber === numberOfChunks &&
      fileSize !== (totalSize % chunkSize) + chunkSize
    ) {
      validation.valid = false;
      validation.message = 'Incorrect final chunk size';
      return validation;
    }

    // Validation: The file is only a single chunk, and the data size does not fit
    if (numberOfChunks === 1 && fileSize !== totalSize) {
      validation.valid = false;
      validation.message = 'Incorrect individual chunk size';
      return validation;
    }
  }

  return validation;
}

function validateChecksum(filename, checksum) {
  var fileData = fs.readFileSync(filename);
  var generatedChecksum = crypto
    .createHash('md5')
    .update(fileData)
    .digest('hex');
  return generatedChecksum === checksum;
}

module.exports = {
  setUploadDirectory: setUploadDirectory,
  get: get,
  post: post,
};
