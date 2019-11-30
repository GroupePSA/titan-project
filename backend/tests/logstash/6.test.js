var expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require("chai-http");

var app = require("../../app")

chai.use(chaiHttp);
chai.should();

const config = require("./config")

describe("Logstash testing", function () {

  this.slow(100)
  this.timeout(config.MAX_TIMEOUT);

  it("should work with multiline codec", function (done) {
    if (!config.enable_slow_tests) this.skip()

    formData = {
      input_data: "hi\n ho\n ha\nhou\ lol",
      logstash_filter: "filter{mutate{add_field=>{'test'=> 'test2'}}}",
      custom_codec: 'multiline { pattern => "^\\s" what => "previous" }',
      input_extra_fields: [{ attribute: "type", value: "superTest" }],
      logstash_version: config.logstashVersion
    }

    chai.request(app)
      .post('/logstash/start')
      .send(formData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.config_ok).to.equal(true);
        expect(res.body.succeed).to.equal(true);
        expect(res.body.job_result.status).to.equal(0);
        var accolade_left_number = (res.body.job_result.stdout.match(/{/g) || []).length
        var accolade_right_number = (res.body.job_result.stdout.match(/{/g) || []).length
        expect(accolade_left_number).not.to.equal(0);
        expect(accolade_right_number).not.to.equal(0);
        expect(res.body.job_result.stdout).to.match(/hi/);
        expect(res.body.job_result.stdout).to.match(/ho/);
        expect(res.body.job_result.stdout).to.match(/superTest/);
        expect(res.body.job_result.stdout).not.to.match(/hou/);
        expect(res.body.job_result.stdout).not.to.match(/lol/);
        done();
      });
  });

});
