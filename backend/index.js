var spawnSync = require('child_process').spawnSync;

const express = require('express')
var quote = require('shell-quote').quote;

var INPUT_FILTER = "input{stdin{}}";
var OUTPUT_FILTER = "output{stdout{}}";

const app = express()

app.use(express.json());

app.get('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "message": "Nothing here !"}));
})

function getResult(input, filter) {
    res = spawnSync('echo ' + input + ' | /usr/share/logstash/bin/logstash -e ' + filter + ' -i', {
        shell: true,
        timeout: 60000
    });
    var ret = {
        stdout: res.stdout.toString('utf8').split(/\r?\n/),
        stderr: res.stderr.toString('utf8').split(/\r?\n/),
        status: res.status
    };
    return ret;
}

app.get('/start_job', function (req, res) {

    var input_data=quote([ req.body.input_data ]);

    var logstash_filter=quote([ INPUT_FILTER + req.body.logstash_filter + OUTPUT_FILTER ]);


    var job_result = getResult(input_data, logstash_filter)

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ "job_result": job_result}));
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
})
