const fs = require('fs-extra')
const path = require('path')

const logger = require("./logger").logger;

const constants = require("./constants")

// Check if a filehash is valid or not

function isFilehashValid(hash) {
    return hash.match(/^[a-zA-Z0-9]{128}$/g)
}

// Write a string content to file

function writeStringToFile(log, filepath, data, callback) {
    fs.writeFile(filepath, data, function (err) {
        if (err) {
            if(log == null) {
                log = logger
            }
            log.error({
                "action": "file_write",
                "state": "failed"
            }, "Unable to write data to file '" + filepath + "'");
        }
        callback(err)
    });
}

// Delete a file from disk

function deleteFile(log, filepath, callback) {
    fs.unlink(filepath, function (err) {
        if (err) {
            if(log == null) {
                log = logger
            }
            log.error({
                "action": "file_deletion",
                "state": "failed",
                "path": filepath
            }, "Unable to delete file '" + filepath + "'");
        }
        callback(err)
    });
}

// Delete files older than X milliseconds

function deleteFilesOlderThan(rootDirectory, duration_ms) {
    fs.readdir(rootDirectory, function(err, files) {
        files.forEach(function(file, index) {
          var filepath = path.join(rootDirectory, file)
          fs.stat(filepath, function(err, stat) {
            if (err) {
                logger.warn({
                    "action": "file_stats",
                    "state": "failed"
                }, "Failed to get file stats '" + filepath + "' : " + err )
            } else if (!stat.isDirectory()) {
                var now = new Date().getTime();
                var endTime = new Date(stat.ctime).getTime() + duration_ms;
                if (now > endTime) {
                    fs.unlink(filepath, function (err) {
                        if(err) {
                            logger.warn({
                                "action": "file_deletion",
                                "state": "failed",
                                "path": filepath
                            },"Failed to delete file '" + filepath + "' : " + err )
                        } else {
                            logger.debug({
                                "action": "file_deletion",
                                "state": "success",
                                "path": filepath
                            }, "Successfully deleted file '" + filepath + "'")
                        }
                    });
                }
            }
            
          });
        });
    });
}

// Build the input user filepath

function buildLocalLogFilepath(hash) {
    return constants.LOGFILES_DIR + hash + ".log";
}

module.exports = {
    isFilehashValid: isFilehashValid,
    writeStringToFile: writeStringToFile,
    deleteFile: deleteFile,
    deleteFilesOlderThan: deleteFilesOlderThan,
    buildLocalLogFilepath: buildLocalLogFilepath
};
