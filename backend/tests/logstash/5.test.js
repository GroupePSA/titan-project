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

  it("should work with basic parameters on uploaded file", function (done) {
    if (!config.enable_slow_tests) this.skip()

    var filehash = "CCC720F871674C18E5FECFF61D92C1355CD4BFAC25699FB7DDFE7717C9669B4D085193982402156122DFAA706885FD64741704649795C65B2A5BDEC40347E28A";

    formDataInitial = {
      hash: filehash,
      file_content: "hi\nho\nha\nhou\nlol"
    }

    chai.request(app)
      .post('/file/upload')
      .send(formDataInitial)
      .end((err, res) => {
        expect(err).to.equal(null)

        formData = {
          filehash: filehash,
          logstash_filter: "filter{mutate{add_field=>{'test'=> 'test2'}}}",
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
            expect(res.body.job_result.stdout).to.match(/hou/);
            expect(res.body.job_result.stdout).to.match(/ha/);
            done();
          });
      });
  });

});
