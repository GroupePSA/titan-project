const cron = require("node-cron")

var system = require("../utils/system")
const constants = require("../utils/constants")
const logger = require("../utils/logger").logger

// Start the cleaning process
function startCleaningProcess() {
    logger.info({
        "action": "start_cleanup"
    }, "Starting cleanup job for old files")
    system.deleteFilesOlderThan(constants.LOGFILES_DIR, constants.CLEANUP_FILE_OLDER_THAN_MS)
}

// Launch the cron
cron.schedule(constants.CLEANUP_FILE_CRON, startCleaningProcess);

module.exports = {
    startCleaningProcess: startCleaningProcess
};
