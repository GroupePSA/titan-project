#!/bin/bash
cat /app/data.log | LS_JAVA_OPTS="-Xms${LOGSTASH_RAM:-1g} -Xmx${LOGSTASH_RAM:-1g}" /logstash/bin/logstash --log.level ${LOG_LEVEL:-warn} --path.data /tmp/logstash/data --pipeline.unsafe_shutdown -w ${THREAD_WORKER:-1} -f /app/logstash.conf -i 