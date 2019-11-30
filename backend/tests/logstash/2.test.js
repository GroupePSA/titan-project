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

  it("should work with custom pattern", function (done) {
    if (!config.enable_slow_tests) this.skip()

    formData = {
      input_data: "HAHA\nHOHO\nHUHU",
      custom_logstash_patterns: "STR_UPPER [A-Z]*\n",
      logstash_filter: 'filter{ grok { match => { "message" => "%{STR_UPPER:test}" } }}',
      input_extra_fields: [],
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
        expect(res.body.job_result.stdout).to.match(/HAHA/);
        expect(res.body.job_result.stdout).to.match(/HOHO/);
        expect(res.body.job_result.stdout).to.match(/HUHU/);
        expect(res.body.job_result.stdout).to.match(/test/);
        done();
      });
  });

});
