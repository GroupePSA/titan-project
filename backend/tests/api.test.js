var expect = require("chai").expect;
var chai = require("chai");
var chaiHttp = require("chai-http");

var app = require("../app")

chai.use(chaiHttp);
chai.should();

const config = require("./logstash/config")

describe("API Testing", function () {

  this.slow(100)

  describe("/", function () {

    it("returns status 200", function (done) {
      chai.request(app)
        .get('/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });

  });


  describe("/logstash", function () {

    describe("/start", function () {

      it("without parameters", function (done) {
        formData = {
        }

        chai.request(app)
          .post('/logstash/start')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.config_ok).to.equal(false);
            expect(res.body.succeed).to.equal(false);
            expect(res.body.missing_fields.length).to.equal(4);
            expect(res.body.missing_fields).to.contain("logstash_filter");
            expect(res.body.missing_fields).to.contain("input_data");
            expect(res.body.missing_fields).to.contain("filehash");
            expect(res.body.missing_fields).to.contain("logstash_version");
            done();
          });

      });

      it("with missing parameters", function (done) {
        formData = {
          input_data: "hi\nho\nha\nhou\nlol"
        }

        chai.request(app)
          .post('/logstash/start')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.config_ok).to.equal(false);
            expect(res.body.succeed).to.equal(false);
            expect(res.body.missing_fields.length).to.equal(2);
            expect(res.body.missing_fields).to.contain("logstash_filter");
            expect(res.body.missing_fields).to.contain("logstash_version");
            done();
          });
      });

      it("with incompatible parameters", function (done) {
        formData = {
          input_data: "hi\nho\nha\nhou\nlol",
          logstash_filter: "filter{mutate{add_field=>{'test'=> 'test2'}}}",
          filehash: "1F9720F871674C18E5FECFF61D92C1355CD4BFAC25699FB7DDFE7717C9669B4D085193982402156122DFAA706885FD64741704649795C65B2A5BDEC40347E28A",
          logstash_version: "1.2.3"
        }

        chai.request(app)
          .post('/logstash/start')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.config_ok).to.equal(false);
            expect(res.body.succeed).to.equal(false);
            expect(res.body.missing_fields.length).to.equal(2);
            expect(res.body.missing_fields).to.contain("input_data");
            expect(res.body.missing_fields).to.contain("filehash");
            done();
          });

      });

    });

    describe("/versions", function () {

      it("get the logstash versions", function (done) {

        chai.request(app)
          .get('/logstash/versions')
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.succeed).to.equal(true);
            expect(res.body.versions.length).to.not.equal(0);
            expect(res.body.versions).to.contain(config.logstashVersion);
            done();
          });

      });

    });

  });

  describe("/grok_tester", function () {

    it("work with a working grok pattern", function (done) {
      formData = {
        line: 'Dec 23 12:11:43 louis postfix/smtpd[31499]: connect from unknown[95.75.93.154]',
        grok_pattern: "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}"
      }

      chai.request(app)
        .post('/grok_tester')
        .send(formData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.config_ok).to.equal(true);
          expect(res.body.succeed).to.equal(true);
          done();
        });
    });

    it("work with a working grok pattern", function (done) {
      formData = {
        line: 'Dec 23 12:11:43 louis postfix/smtpd[31499]: connect from unknown[95.75.93.154]',
        grok_pattern: "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{DATA:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATATEST:syslog_message}",
        extra_patterns: "GREEDYDATATEST .*"
      }
      chai.request(app)
        .post('/grok_tester')
        .send(formData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.config_ok).to.equal(true);
          expect(res.body.succeed).to.equal(true);
          done();
        });
    });

    it("work with a semi-working grok pattern", function (done) {
      formData = {
        line: 'Dec 23 12:11:43 louis postfix/smtpd[31499]: connect from unknown[95.75.93.154]',
        grok_pattern: "%{SYSLOGTIMESTAMP:syslog_timestamp} %{SYSLOGHOST:syslog_hostname} %{NUMBER:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}"
      }
      chai.request(app)
        .post('/grok_tester')
        .send(formData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.config_ok).to.equal(true);
          expect(res.body.succeed).to.equal(true);
          done();
        });
    });

    it("work with a bad grok pattern", function (done) {
      formData = {
        line: 'Dec 23 12:11:43 louis postfix/smtpd[31499]: connect from unknown[95.75.93.154]',
        grok_pattern: "^%{NUMBER:syslog_program}(?:\[%{POSINT:syslog_pid}\])?: %{GREEDYDATA:syslog_message}"
      }
      chai.request(app)
        .post('/grok_tester')
        .send(formData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.config_ok).to.equal(true);
          expect(res.body.succeed).to.equal(true);
          done();
        });
    });

    it("don't work with missing parameters", function (done) {
      formData = {
      }
      chai.request(app)
        .post('/grok_tester')
        .send(formData)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body.config_ok).to.equal(false);
          expect(res.body.succeed).to.equal(false);
          done();
        });
    });

  });

  describe("/guess_config", function () {

    it("guess for a classical log file input", function (done) {
      formData = {
        input_data: "hi\nho\nha\nhou\nlol"
      }

      chai.request(app)
        .post('/guess_config')
        .send(formData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.config_ok).to.equal(true);
          expect(res.body.succeed).to.equal(true);
          expect(res.body.logstash_filter).to.equal('filter {\n\n  grok {\n    match => {\n      "message" => "%{GREEDYDATA:text}"\n    }\n  }\n}')
          expect(res.body.custom_codec).to.equal('')
          done();
        });
    });

    it("guess for an uploaded log file", function (done) {
      var filehash = "BBB720F871674C18E5FECFF61D92C1355CD4BFAC25699FB7DDFE7717C9669B4D085193982402156122DFAA706885FD64741704649795C65B2A5BDEC40347E28A";

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
            filehash: filehash
          }

          chai.request(app)
            .post('/guess_config')
            .send(formData)
            .end((err, res) => {
              expect(res).to.have.status(200);
              expect(res.body.config_ok).to.equal(true);
              expect(res.body.succeed).to.equal(true);
              expect(res.body.logstash_filter).to.equal('filter {\n\n  grok {\n    match => {\n      "message" => "%{GREEDYDATA:text}"\n    }\n  }\n}')
              expect(res.body.custom_codec).to.equal('')
              done();
            });
        });

    });

  });


  describe("/config", function () {

    describe("/store", function () {

      it("store a config", function (done) {
        formData = {
          hash: "fds",
          config: "my full config"
        }
        chai.request(app)
          .post('/config/store')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.config_ok).to.equal(true);
            expect(res.body.succeed).to.equal(true);
            done();
          });
      });

    });

    describe("/get", function () {

      it("get a non-existing config", function (done) {
        formData = {
          hash: "fds_unknown"
        }
        chai.request(app)
          .post('/config/get')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.config_ok).to.equal(true);
            expect(res.body.succeed).to.equal(false);
            done();
          });
      });

      it("get with no parameters", function (done) {
        formData = {
        }
        chai.request(app)
          .post('/config/get')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.config_ok).to.equal(false);
            done();
          });
      });

      it("get an existing config", function (done) {
        formDataInitial = {
          hash: "superhash",
          config: "my full config abc"
        }

        chai.request(app)
          .post('/config/store')
          .send(formDataInitial)
          .end((err, res) => {
            expect(err).to.equal(null)

            formData = {
              hash: "superhash"
            }

            chai.request(app)
              .post('/config/get')
              .send(formData)
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.config_ok).to.equal(true);
                expect(res.body.succeed).to.equal(true);
                expect(res.body.config.value).to.equal(formDataInitial.config);
                done();
              });
          });

      });

    });

  });

  describe("/file", function () {

    describe("/upload", function () {

      it("store a logfile", function (done) {
        formData = {
          hash: "1F9720F871674C18E5FECFF61D92C1355CD4BFAC25699FB7DDFE7717C9669B4D085193982402156122DFAA706885FD64741704649795C65B2A5BDEC40347E28A",
          file_content: "my log file content\n and another line"
        }
        chai.request(app)
          .post('/file/upload')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.config_ok).to.equal(true);
            expect(res.body.succeed).to.equal(true);
            done();
          });
      });

    });

    describe("/exists", function () {

      it("check existance for a non-existing logfile", function (done) {
        formData = {
          hash: "random_nonexistant_hash"
        }
        chai.request(app)
          .post('/file/exists')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.config_ok).to.equal(true);
            expect(res.body.succeed).to.equal(true);
            expect(res.body.exists).to.equal(false);
            done();
          });
      });

      it("check existance of existing file", function (done) {
        formData = {
        }
        chai.request(app)
          .post('/file/exists')
          .send(formData)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body.config_ok).to.equal(false);
            done();
          });
      });

      it("assert existance of an existing logfile", function (done) {
        var filehash = "AAA720F871674C18E5FECFF61D92C1355CD4BFAC25699FB7DDFE7717C9669B4D085193982402156122DFAA706885FD64741704649795C65B2A5BDEC40347E28A";

        formDataInitial = {
          hash: filehash,
          file_content: "my log file content\n and another line\nand another"
        }

        chai.request(app)
          .post('/file/upload')
          .send(formDataInitial)
          .end((err, res) => {
            expect(err).to.equal(null)

            formData = {
              hash: filehash
            }

            chai.request(app)
              .post('/file/exists')
              .send(formData)
              .end((err, res) => {
                expect(res.body.config_ok).to.equal(true);
                expect(res.body.succeed).to.equal(true);
                expect(res.body.exists).to.equal(true);
                done();
              });
          });

      });

    });

  });


});
