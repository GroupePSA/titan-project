var expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require("chai-http");
var moment = require('moment')

var app = require("../../app")

chai.use(chaiHttp);
chai.should();

const config = require("./config")

describe("Logstash testing", function () {

  this.slow(100)
  this.timeout(config.MAX_TIMEOUT);

  it("non-cache operation should still be saved into cache & being used", function (done) {
    if (!config.enable_slow_tests) this.skip()

    formData = {
      input_data: "hi\nho\nha\nhou\nlol\nmorille3",
      logstash_filter: "filter{}",
      input_extra_fields: [{ attribute: "type", value: "superTest" }],
      logstash_version: config.logstashVersion,
      no_cache: true
    }

    var t1 = moment()
    chai.request(app)
      .post('/logstash/start')
      .send(formData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.config_ok).to.equal(true);
        expect(res.body.succeed).to.equal(true);
        expect(res.body.job_result.stdout).to.match(/hi/);
        expect(res.body.job_result.stdout).to.match(/morille3/);

        var t2 = moment()
        var timeDifference = t2.diff(t1, 'seconds')

        expect(timeDifference > 3).to.be.true // Should be slow

        formData = {
          input_data: "hi\nho\nha\nhou\nlol\nmorille3",
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

            var t3 = moment()
            var timeDifference = t3.diff(t2, 'seconds')

            expect(timeDifference < 1).to.be.true // Should be fast

            done();
          });
       
      });

  });
});

