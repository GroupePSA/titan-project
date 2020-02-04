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

  it("should work with trace off but grok parse failure", function (done) {
    if (!config.enable_slow_tests) this.skip()

    formData = {
      input_data: "fsd",
      logstash_filter: 'filter {\n\n    grok {\n      match => {\n        "message" => "%{INT:test}"\n      }\n    }\n    \n    grok {\n      match => {\n        "message" => "%{INT:test2}"\n      }\n    }\n\n}',
      input_extra_fields: [],
      trace: false,
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
        expect(res.body.job_result.stdout).to.match(/_grokparsefailure/);
        expect(res.body.job_result.stdout).not.to.match(/failure line 3/);
        expect(res.body.job_result.stdout).not.to.match(/failure line 9/);
        done();
      });

  });

});
