#!/bin/bash
export LS_JAVA_OPTS="-Xms${LOGSTASH_RAM:-1g} -Xmx${LOGSTASH_RAM:-1g}"
ln -s /app/data.log /app/data.yml
timeout --preserve-status -k 10 ${MAX_EXEC_TIMEOUT:-120} bash -c 'logstash-filter-verifier --logstash-path=/logstash/bin/logstash /app/data.yml /app/logstash.conf --diff-command="cat" --keep-env=LS_JAVA_OPTS --logstash-arg=--log.level --logstash-arg=${LOG_LEVEL:-warn} --logstash-arg=--path.data --logstash-arg=/tmp/logstash/data --logstash-arg=--pipeline.unsafe_shutdown'
rm /app/data.yml