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

  it("with bad logstash filter", function (done) {
    if (!config.enable_slow_tests) this.skip()

    formData = {
      input_data: "hi\nho\nha\nhou\nlol",
      logstash_filter: "filter mutate{add_field=>{'test'=> 'test2'}}}",
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
        expect(res.body.job_result.status).not.to.equal(0);
        expect(res.body.job_result.stdout).not.to.match(/hou/);
        expect(res.body.job_result.stdout).not.to.match(/test2/);
        done();
      });
  });

});
