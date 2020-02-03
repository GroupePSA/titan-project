var express = require('express');
var router = express.Router();

const NodeGrok = require("grok-js")

const constants = require("../utils/constants")
const log = require("../utils/logger").logger

router.post('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    if (!req.body.line || !req.body.grok_pattern) {
        res.status(400);
        res.send(JSON.stringify({ "config_ok": false, "succeed": false }));
    } else {
        var line = req.body.line
        var grok_pattern = req.body.grok_pattern

        res.status(200);

        var results = []

        // We init the grok process
        grok = new NodeGrok.GrokCollection()
        grok.loadSync("./data/grok-patterns")
        if (req.body.extra_patterns != undefined) {
            addPatternsToGrok(grok, req.body.extra_patterns)
        }

        // We cut the initial grok pattern
        var re = /(%{\w+(?::\w+)?}|\(\?:[^\()]*\)|\(\?<\w+>[^\()]*\)|\\.|.)/g
        var grok_parts = Array.from(grok_pattern.matchAll(re))

        var reconstructed_grok = ""

        for (i in grok_parts) {
            reconstructed_grok += grok_parts[i]
            try {
                var result = getGrokResult(grok, reconstructed_grok, line)
                results.push({
                    "pattern": reconstructed_grok,
                    "diff": grok_parts[i],
                    "result": result
                })
            } catch (error) {
                results.push({
                    "pattern": reconstructed_grok,
                    "result": null,
                    "diff": grok_parts[i],
                    "error": error
                })
            }
        }

        if (results.length != 0 && results[results.length - 1] != null) {
            op_per_seconds = undefined
            if (constants.COMPUTE_GROK_PERFORMANCES == "true") {
                try {
                    op_per_seconds = computeGrokPerformance(grok, grok_pattern, line)
                } catch (error) {
                    log.warn("Pattern '" + grok_pattern + "' is invalid")
                }
            }
            res.send(JSON.stringify({ "config_ok": true, "succeed": true, "results": results, "operations_per_second": op_per_seconds }));
        } else {
            res.send(JSON.stringify({ "config_ok": true, "succeed": false }));
        }

    }
})

// Add a pattern to a grok
function addPatternsToGrok(grok, patternsLine) {
    var patternsLineArray = patternsLine.split(/\r?\n/)
    var splitLineRegex = /^([\w_]+)\s+(.*)/
    for (i in patternsLineArray) {
        patternLine = patternsLineArray[i]
        match = splitLineRegex.exec(patternLine)
        if (match != null && match.length == 3) {
            grok.createPattern(match[2], match[1])
        }
    }
}

// Apply a grok pattern on a line
function getGrokResult(grok, grok_pattern, line) {
    var pattern = grok.createPattern(grok_pattern)
    return pattern.parseSync(line)
}


// Compute the performance (events / seconds) of the grok
// Return the number of events / seconds processed
function computeGrokPerformance(grok, grok_pattern, line) {
    var loopNumber = 1000
    var pattern = grok.createPattern(grok_pattern)

    var start = new Date()

    for (var i = 0; i < loopNumber; i++) {
        try {
            pattern.parseSync(line)
        } catch (error) {
            throw error
        }
    }

    var end = new Date() - start
    return Math.round(1000 / (end / loopNumber))
}

// Match all prototype
String.prototype.matchAll = function (regexp) {
    var matches = [];
    this.replace(regexp, function () {
        var arr = ([]).slice.call(arguments, 0);
        matches.push(arr[0]);
    });
    return matches.length ? matches : null;
};

module.exports = router;
