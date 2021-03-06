var express = require('express');
var router = express.Router();

var exec = require('child_process').exec;
var uniqid = require('uniqid');
const fs = require('fs-extra')

var system = require("../utils/system")
const constants = require("../utils/constants")
const log = require('../utils/logger').logger;


// Try to guess the config using the Kibana Machine Learning API

router.post('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    if (req.body.filehash == undefined && req.body.input_data == null) {
        res.status(400);
        res.send(JSON.stringify({ "config_ok": false }));
    } else {
        if (req.body.filehash != undefined) {
            var filepath = system.buildLocalLogFilepath(req.body.filehash)
            guessConfig(res, filepath, function () {})
        } else {
            var filehash = uniqid()
            filepath = constants.LOGFILES_TEMP_DIR + filehash + ".log"
            system.writeStringToFile(null, filepath, req.body.input_data, () => {
                guessConfig(res, filepath, function () {
                    fs.remove(filepath, err => {
                        if (err) {
                            log.warn({
                                "action": "file_deletion",
                                "state": "failed",
                                "path": filepath
                            }, "Failed to delete file '" + filepath + "'")
                        }
                    })
                })
            })
        }
    }
})


// Function to try to guess a config

function guessConfig(res, filepath, callback) {
    res.setHeader('Content-Type', 'application/json');

    try {
        exec("/usr/local/bin/parser -json " + filepath, {}, (err, stdout, stderr) => {
            var result = JSON.parse(stdout)
            callback()
            result['config_ok'] = true
            res.send(result);
        });
    } catch (ex) {
        var job_result = {
            stderr: "",
            stdout: ex.toString('utf8'),
            status: -1
        };
        callback()
        res.send(JSON.stringify({
            "config_ok": true,
            "job_result": job_result,
            "suceed": false
        }));
    }
}

module.exports = router;
