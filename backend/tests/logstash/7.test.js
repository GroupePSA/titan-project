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

  it("with cache enabled", function (done) {
    if (!config.enable_slow_tests) this.skip()

    formData = {
      input_data: "hi\nho\nha\nhou\nlol\nmorille",
      logstash_filter: "filter{}",
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
        expect(res.body.job_result.stdout).to.match(/hi/);
        expect(res.body.job_result.stdout).to.match(/morille/);
        expect(res.body.cached).to.equal(false);

        chai.request(app)
          .post('/logstash/start')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.config_ok).to.equal(true);
            expect(res.body.succeed).to.equal(true);
            expect(res.body.job_result.stdout).to.match(/hi/);
            expect(res.body.job_result.stdout).to.match(/morille/);
            expect(res.body.cached).to.equal(true);

            done();
          });
       
      });

  });
});

