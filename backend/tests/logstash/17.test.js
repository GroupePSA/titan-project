var expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require("chai-http");

var app = require("../../app")

chai.use(chaiHttp);
chai.should();

const config = require("./config")

describe("Logstash testing TDD", function () {

  this.slow(100)
  this.timeout(config.MAX_TIMEOUT);

  it("should work with basic parameters", function (done) {
    if (!config.enable_slow_tests) this.skip()

    formData = {
      input_data: 'fields:\n  type: "syslog"\ntestcases:\n  - input:\n      - "Oct  6 20:55:29 myhost myprogram[31993]: This is a test message"\n    expected:\n      - "@timestamp": "2015-10-06T20:55:29.000Z"\n        host: "myhost"\n        message: "This is a test message"\n        pid: 31993\n        program: "myprogram"\n        type: "syslog"\n  - input:\n      - "Oct  6 20:55:29 myhost myprogram: This is a test message 2"\n    expected:\n      - "@timestamp": "2015-10-06T20:55:29.000Z"\n        host: "myhost"\n        message: "This is a test message 2"\n        program: "myprogram"\n        type: "syslog"',
      logstash_filter: "filter{mutate{add_field=>{'test'=> 'test2'}}}",
      input_extra_fields: [{ attribute: "type", value: "superTest" }],
      logstash_version: config.logstashVersion,
      mode: "test"
    }

    chai.request(app)
      .post('/logstash/start')
      .send(formData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.config_ok).to.equal(true);
        expect(res.body.succeed).to.equal(true);
        expect(res.body.config_ok).to.equal(true);
        expect(res.body.job_result.stdout).to.match(/myhost myprogram\[31993\]: This is a test message/);
        expect(res.body.job_result.stdout).to.match(/myhost myprogram: This is a test message 2/);
        expect(res.body.job_result.stdout).to.match(/test2/);
        expect(res.body.job_result.testCases).to.not.be.null
        expect(res.body.job_result.testCases.length).to.be.equal(2)
        expect(res.body.job_result.testCases[0].real).to.match(/This is a test message/);
        expect(res.body.job_result.testCases[0].expected).to.match(/This is a test message/)
        expect(res.body.job_result.testCases[1].real).to.match(/This is a test message 2/);
        expect(res.body.job_result.testCases[1].expected).to.match(/This is a test message 2/);      
        done();
      });
  });

});
