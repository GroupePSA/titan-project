FROM ubuntu:bionic

ARG JDK_VERSION

RUN apt-get update \
    && apt-get install openjdk-${JDK_VERSION}-jre-headless wget tar -y

RUN useradd -ms /bin/bash logstash
RUN mkdir /logstash && chown -R logstash /logstash

RUN wget -q https://github.com/magnusbaeck/logstash-filter-verifier/releases/download/1.6.0/logstash-filter-verifier_1.6.0_linux_amd64.tar.gz \
    && tar -C /usr/local/bin/ -zxsf logstash-filter-verifier_1.6.0_linux_amd64.tar.gz ./logstash-filter-verifier \
    && rm logstash-filter-verifier_1.6.0_linux_amd64.tar.gz

USER logstash

WORKDIR /logstash

ARG LOGSTASH_VERSION

RUN wget -q https://artifacts.elastic.co/downloads/logstash/logstash-${LOGSTASH_VERSION}.tar.gz \
    && tar -C /logstash -zxsf logstash-${LOGSTASH_VERSION}.tar.gz logstash-${LOGSTASH_VERSION}/ --strip-components=1 \
    && rm logstash-${LOGSTASH_VERSION}.tar.gz

RUN echo "" > /logstash/config/logstash.yml

COPY jvm-jdk-${JDK_VERSION}.options /logstash/config/jvm.options

COPY update_logstash_plugins.sh /tmp/update_logstash_plugins.sh

ARG PLUGINS_TO_ADD=""
ARG PLUGINS_TO_REMOVE=""
ARG UPDATE_PLUGINS="false"
ENV PLUGINS_TO_ADD=$PLUGINS_TO_ADD
ENV PLUGINS_TO_REMOVE=$PLUGINS_TO_REMOVE
ENV UPDATE_PLUGINS=$UPDATE_PLUGINS

RUN /tmp/update_logstash_plugins.sh

COPY entrypoint.sh /entrypoint.sh
COPY entrypoint-tdd.sh /entrypoint-tdd.sh

USER root

RUN chmod +x /entrypoint.sh /entrypoint-tdd.sh

USER logstash

ENTRYPOINT [ "/entrypoint.sh" ]