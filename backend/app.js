// Includes

const fs = require('fs-extra')
const express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const pinoExpress = require("./utils/logger").pinoExpress
const log = require("./utils/logger").logger

const constants = require("./utils/constants")

require("./process/cleanup")

// Routes

var indexRouter = require('./routes/index');
var configRouter = require('./routes/config');
var fileRouter = require('./routes/file');
var guessConfigRouter = require('./routes/guess_config');
var grokTesterRouter = require('./routes/grok_tester');
var logstashRouter = require('./routes/logstash');

///////////////////////////////
// Some system util function //
///////////////////////////////

// We create the local directories directory

fs.ensureDirSync(constants.LOGSTASH_DATA_DIR)
fs.ensureDirSync(constants.LOGFILES_DIR)
fs.ensureDirSync(constants.LOGFILES_TEMP_DIR)
fs.ensureDirSync(constants.LOGSTASH_TMP_DIR)

//////////////////
//  Server part //
//////////////////

// Some init definitions

const app = express()
app.use(cors())
app.use(bodyParser.json({ limit: constants.JSON_BODY_LIMIT }))
app.use(pinoExpress)

app.use('/', indexRouter);
app.use('/config', configRouter);
app.use('/file', fileRouter);
app.use('/guess_config', guessConfigRouter);
app.use('/grok_tester', grokTesterRouter);
app.use('/logstash', logstashRouter);

module.exports = app;
