ace.define("ace/mode/logstash_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
        i = e("./text_highlight_rules").TextHighlightRules,
        s = t.constantOtherSymbol = {
            token: "constant.other.symbol.logstash",
            regex: "[:](?:[A-Za-z_]|[@$](?=[a-zA-Z0-9_]))[a-zA-Z0-9_]*[!=?]?"
        },
        o = t.qString = {
            token: "string",
            regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']"
        },
        u = t.qqString = {
            token: "string",
            regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]'
        },
        a = t.tString = {
            token: "string",
            regex: "[`](?:(?:\\\\.)|(?:[^'\\\\]))*?[`]"
        },
        f = t.constantNumericHex = {
            token: "constant.numeric",
            regex: "0[xX][0-9a-fA-F](?:[0-9a-fA-F]|_(?=[0-9a-fA-F]))*\\b"
        },
        l = t.constantNumericFloat = {
            token: "constant.numeric",
            regex: "[+-]?\\d(?:\\d|_(?=\\d))*(?:(?:\\.\\d(?:\\d|_(?=\\d))*)?(?:[eE][+-]?\\d+)?)?\\b"
        },
        c = t.instanceVariable = {
            token: "variable.instance",
            regex: "@{1,2}[a-zA-Z_\\d]+|\[[a-zA-Z_.]+\]"
        },
        // To generate them :
        // git clone https://github.com/logstash-plugins/logstash-patterns-core.git
        // cat logstash-patterns-core/patterns/* | grep "^[A-Z]" | cut -d" " -f1 | sort | uniq | paste -sd "|" -
        logstash_grok_patterns = "BACULA_CAPACITY|BACULA_DEVICE|BACULA_DEVICEPATH|BACULA_HOST|BACULA_JOB|BACULA_LOG_ALL_RECORDS_PRUNED|BACULA_LOG_BEGIN_PRUNE_FILES|BACULA_LOG_BEGIN_PRUNE_JOBS|BACULA_LOG_CANCELLING|BACULA_LOG_CLIENT_RBJ|BACULA_LOG_DIFF_FS|BACULA_LOG_DUPLICATE|BACULA_LOG_ENDPRUNE|BACULA_LOG_END_VOLUME|BACULA_LOG_FATAL_CONN|BACULA_LOG_JOB|BACULA_LOG_JOBEND|BACULA_LOGLINE|BACULA_LOG_MARKCANCEL|BACULA_LOG_MAX_CAPACITY|BACULA_LOG_MAXSTART|BACULA_LOG_NEW_LABEL|BACULA_LOG_NEW_MOUNT|BACULA_LOG_NEW_VOLUME|BACULA_LOG_NO_AUTH|BACULA_LOG_NO_CONNECT|BACULA_LOG_NOJOBS|BACULA_LOG_NOJOBSTAT|BACULA_LOG_NOOPEN|BACULA_LOG_NOOPENDIR|BACULA_LOG_NOPRIOR|BACULA_LOG_NOPRUNE_FILES|BACULA_LOG_NOPRUNE_JOBS|BACULA_LOG_NOSTAT|BACULA_LOG_NOSUIT|BACULA_LOG_PRUNED_FILES|BACULA_LOG_PRUNED_JOBS|BACULA_LOG_READYAPPEND|BACULA_LOG_STARTJOB|BACULA_LOG_STARTRESTORE|BACULA_LOG_USEDEVICE|BACULA_LOG_VOLUME_PREVWRITTEN|BACULA_LOG_VSS|BACULA_LOG_WROTE_LABEL|BACULA_TIMESTAMP|BACULA_VERSION|BACULA_VOLUME|BASE10NUM|BASE16FLOAT|BASE16NUM|BIND9|BIND9_TIMESTAMP|BRO_CONN|BRO_DNS|BRO_FILES|BRO_HTTP|CATALINA_DATESTAMP|CATALINALOG|CISCO_ACTION|CISCO_DIRECTION|CISCOFW104001|CISCOFW104002|CISCOFW104003|CISCOFW104004|CISCOFW105003|CISCOFW105004|CISCOFW105005|CISCOFW105008|CISCOFW105009|CISCOFW106001|CISCOFW106006_106007_106010|CISCOFW106014|CISCOFW106015|CISCOFW106021|CISCOFW106023|CISCOFW106100|CISCOFW106100_2_3|CISCOFW110002|CISCOFW302010|CISCOFW302013_302014_302015_302016|CISCOFW302020_302021|CISCOFW304001|CISCOFW305011|CISCOFW313001_313004_313008|CISCOFW313005|CISCOFW321001|CISCOFW402117|CISCOFW402119|CISCOFW419001|CISCOFW419002|CISCOFW500004|CISCOFW602303_602304|CISCOFW710001_710002_710003_710005_710006|CISCOFW713172|CISCOFW733100|CISCO_INTERVAL|CISCOMAC|CISCO_REASON|CISCOTAG|CISCO_TAGGED_SYSLOG|CISCOTIMESTAMP|CISCO_XLATE_TYPE|CLOUDFRONT_ACCESS_LOG|COMBINEDAPACHELOG|COMMONAPACHELOG|COMMONMAC|CRON_ACTION|CRONLOG|DATA|DATE|DATE_EU|DATESTAMP|DATESTAMP_EVENTLOG|DATESTAMP_OTHER|DATESTAMP_RFC2822|DATESTAMP_RFC822|DATE_US|DAY|ELB_ACCESS_LOG|ELB_REQUEST_LINE|ELB_URI|ELB_URIPATHPARAM|EMAILADDRESS|EMAILLOCALPART|EXIM_DATE|EXIM_EXCLUDE_TERMS|EXIM_FLAGS|EXIM_HEADER_ID|EXIM_INTERFACE|EXIM_MSGID|EXIM_MSG_SIZE|EXIM_PID|EXIM_PROTOCOL|EXIM_QT|EXIM_REMOTE_HOST|EXIM_SUBJECT|GREEDYDATA|HAPROXYCAPTUREDREQUESTHEADERS|HAPROXYCAPTUREDRESPONSEHEADERS|HAPROXYDATE|HAPROXYHTTP|HAPROXYHTTPBASE|HAPROXYTCP|HAPROXYTIME|HOSTNAME|HOSTPORT|HOUR|HTTPD20_ERRORLOG|HTTPD24_ERRORLOG|HTTPDATE|HTTPD_COMBINEDLOG|HTTPD_COMMONLOG|HTTPDERROR_DATE|HTTPD_ERRORLOG|HTTPDUSER|INT|IP|IPORHOST|IPV4|IPV6|ISO8601_SECOND|ISO8601_TIMEZONE|JAVACLASS|JAVAFILE|JAVALOGMESSAGE|JAVAMETHOD|JAVASTACKTRACEPART|JAVATHREAD|LOGLEVEL|MAC|MAVEN_VERSION|MCOLLECTIVE|MCOLLECTIVEAUDIT|MINUTE|MONGO3_COMPONENT|MONGO3_LOG|MONGO3_SEVERITY|MONGO_LOG|MONGO_QUERY|MONGO_SLOWQUERY|MONGO_WORDDASH|MONTH|MONTHDAY|MONTHNUM|MONTHNUM2|NAGIOS_CURRENT_HOST_STATE|NAGIOS_CURRENT_SERVICE_STATE|NAGIOS_EC_DISABLE_HOST_CHECK|NAGIOS_EC_DISABLE_HOST_NOTIFICATIONS|NAGIOS_EC_DISABLE_HOST_SVC_NOTIFICATIONS|NAGIOS_EC_DISABLE_SVC_CHECK|NAGIOS_EC_DISABLE_SVC_NOTIFICATIONS|NAGIOS_EC_ENABLE_HOST_CHECK|NAGIOS_EC_ENABLE_HOST_NOTIFICATIONS|NAGIOS_EC_ENABLE_HOST_SVC_NOTIFICATIONS|NAGIOS_EC_ENABLE_SVC_CHECK|NAGIOS_EC_ENABLE_SVC_NOTIFICATIONS|NAGIOS_EC_LINE_DISABLE_HOST_CHECK|NAGIOS_EC_LINE_DISABLE_HOST_NOTIFICATIONS|NAGIOS_EC_LINE_DISABLE_HOST_SVC_NOTIFICATIONS|NAGIOS_EC_LINE_DISABLE_SVC_CHECK|NAGIOS_EC_LINE_DISABLE_SVC_NOTIFICATIONS|NAGIOS_EC_LINE_ENABLE_HOST_CHECK|NAGIOS_EC_LINE_ENABLE_HOST_NOTIFICATIONS|NAGIOS_EC_LINE_ENABLE_HOST_SVC_NOTIFICATIONS|NAGIOS_EC_LINE_ENABLE_SVC_CHECK|NAGIOS_EC_LINE_ENABLE_SVC_NOTIFICATIONS|NAGIOS_EC_LINE_PROCESS_HOST_CHECK_RESULT|NAGIOS_EC_LINE_PROCESS_SERVICE_CHECK_RESULT|NAGIOS_EC_LINE_SCHEDULE_HOST_DOWNTIME|NAGIOS_EC_PROCESS_HOST_CHECK_RESULT|NAGIOS_EC_PROCESS_SERVICE_CHECK_RESULT|NAGIOS_EC_SCHEDULE_HOST_DOWNTIME|NAGIOS_EC_SCHEDULE_SERVICE_DOWNTIME|NAGIOS_HOST_ALERT|NAGIOS_HOST_DOWNTIME_ALERT|NAGIOS_HOST_EVENT_HANDLER|NAGIOS_HOST_FLAPPING_ALERT|NAGIOS_HOST_NOTIFICATION|NAGIOSLOGLINE|NAGIOS_PASSIVE_HOST_CHECK|NAGIOS_PASSIVE_SERVICE_CHECK|NAGIOS_SERVICE_ALERT|NAGIOS_SERVICE_DOWNTIME_ALERT|NAGIOS_SERVICE_EVENT_HANDLER|NAGIOS_SERVICE_FLAPPING_ALERT|NAGIOS_SERVICE_NOTIFICATION|NAGIOSTIME|NAGIOS_TIMEPERIOD_TRANSITION|NAGIOS_TYPE_CURRENT_HOST_STATE|NAGIOS_TYPE_CURRENT_SERVICE_STATE|NAGIOS_TYPE_EXTERNAL_COMMAND|NAGIOS_TYPE_HOST_ALERT|NAGIOS_TYPE_HOST_DOWNTIME_ALERT|NAGIOS_TYPE_HOST_EVENT_HANDLER|NAGIOS_TYPE_HOST_FLAPPING_ALERT|NAGIOS_TYPE_HOST_NOTIFICATION|NAGIOS_TYPE_PASSIVE_HOST_CHECK|NAGIOS_TYPE_PASSIVE_SERVICE_CHECK|NAGIOS_TYPE_SERVICE_ALERT|NAGIOS_TYPE_SERVICE_DOWNTIME_ALERT|NAGIOS_TYPE_SERVICE_EVENT_HANDLER|NAGIOS_TYPE_SERVICE_FLAPPING_ALERT|NAGIOS_TYPE_SERVICE_NOTIFICATION|NAGIOS_TYPE_TIMEPERIOD_TRANSITION|NAGIOS_WARNING|NETSCREENSESSIONLOG|NONNEGINT|NOTSPACE|NUMBER|PATH|POSINT|POSTGRESQL|PROG|QS|QUOTEDSTRING|RAILS3|RAILS3FOOT|RAILS3HEAD|RAILS3PROFILE|RCONTROLLER|REDISLOG|REDISMONLOG|REDISTIMESTAMP|RPROCESSING|RT_FLOW1|RT_FLOW2|RT_FLOW3|RT_FLOW_EVENT|RUBY_LOGGER|RUBY_LOGLEVEL|RUUID|S3_ACCESS_LOG|S3_REQUEST_LINE|SECOND|SFW2|SHOREWALL|SPACE|SQUID3|SYSLOG5424BASE|SYSLOG5424LINE|SYSLOG5424PRI|SYSLOG5424PRINTASCII|SYSLOG5424SD|SYSLOGBASE|SYSLOGBASE2|SYSLOGFACILITY|SYSLOGHOST|SYSLOGLINE|SYSLOGPAMSESSION|SYSLOGPROG|SYSLOGTIMESTAMP|TIME|TIMESTAMP_ISO8601|TOMCAT_DATESTAMP|TOMCATLOG|TTY|TZ|UNIXPATH|URI|URIHOST|URIPARAM|URIPATH|URIPATHPARAM|URIPROTO|URN|USER|USERNAME|UUID|WINDOWSMAC|WINPATH|WORD|YEAR",
        
        // To generate them :
        // curl -s https://raw.githubusercontent.com/elastic/logstash/master/rakelib/plugins-metadata.json | grep "logstash" | cut -d'"' -f 2 | cut -d"-" -f3 | sort | uniq | paste -sd "|" -
        logstash_plugins_list = "aggregate|anonymize|avro|azure_event_hubs|beats|cef|cidr|clone|cloudwatch|collectd|couchdb_changes|csv|date|dead_letter_queue|de_dot|dissect|dns|dots|drop|drupal_dblog|dynamodb|edn|edn_lines|elastic_app_search|elasticsearch|email|es_bulk|example|exec|file|fingerprint|fluent|ganglia|gelf|generator|geoip|google_cloud_storage|graphite|grok|heartbeat|heroku|http|http_poller|imap|jdbc|jdbc_static|jdbc_streaming|journald|json|json_lines|kafka|kv|language|line|log4j2|logentries|lumberjack|memcached|metrics|msgpack|multiline|mutate|nagios|neo4j|netflow|newrelic|null|perfmon|pipe|plain|prune|rabbitmq|rackspace|redis|ruby|rubydebug|s3|slack|sleep|snmp|snmptrap|sns|split|sqs|stdin|stdout|syslog|syslog_pri|tcp|throttle|translate|truncate|twitter|udp|unix|urldecode|useragent|uuid|webhdfs|xml|yaml",
        
        // The common options used for Logstash input, filter and output
        //logstash_input_common_options = "|add_field|codec|enable_metric|id|tags|type",
        logstash_filter_common_options = "|add_field|add_tag|enable_metric|id|periodic_flush|remove_field|remove_tag|",
        //logstash_output_common_options = "|codec|enable_metric|id",

        // git clone https://github.com/elastic/logstash-docs.git
        // cat logstash-docs/docs/plugins/{codecs,filters,inputs,outputs}/*.asciidoc | grep "plugins-{type}s-{plugin}" | grep -v "plugins-{type}s-{plugin}-common-options" | grep "^\[" | cut -d'"' -f2 | cut -d"-" -f4 | sed '/^$/d' | sort | uniq | paste -sd "|" -
        logstash_options_all = "access_key_id|account_id|ack|acks|action|add_hostname|additional_codecs|additional_settings|add_metadata_from_env|address|add_timestamp_prefix|after_count|aggregate_maps_path|aggregation_fields|alert_type|algorithm|all_fields|allow_duplicates|allow_duplicate_values|allow_time_override|always_reconnect|annotation|api_key|api_token|api_version|application_name|appname|app_name|arguments|arn|assigned_to_id|attachments|attributes|authentication|authfile|auth_pass|auth_protocol|auto|auto_commit_interval_ms|auto_delete|autodetect_column_names|auto_flush_interval|autogenerate_column_names|automatic_recovery|automatic_retries|auto_offset_reset|aws_credentials_file|backup_add_prefix|backup_to_bucket|backup_to_dir|base64|base64encode|batch|batch_count|batch_events|batch_number|batch_size|batch_size_bytes|batch_timeout|bcc|before_count|best|biased|blacklist_names|blacklist_values|body|body_format|bootstrap_servers|break_on_match|broker_url|bsubtype|btags|btype|bucket|bucket_props|buffer_memory|buffer_size|bulk|bulk_interval|bulk_path|bulk_size|cacert|cache_expiration|cache_save_path|cache_size|cache_ttl|ca_file|canned_acl|can_retry|capitalize|catch_all|categorie_id|cc|channels|charset|check_crcs|check_interval|checkpoint_interval|checkpoint_interval_seconds|chunksize|cipher_padding|cipher_suites|class_name|clean_run|clear_interval|client_cert|client_id|client_inactivity_timeout|client_key|client_secret|clones|close_older|coalesce|code|coerce|coerce_values|collection|columns|columns_charset|combined|command|commandfile|commit_offsets|community|compression|compression_type|concatenate_all_fields|concatenate_sources|condrewrite|condrewriteother|config_mode|congestion_interval|congestion_threshold|connection_retry_attempts|connection_retry_attempts_wait_time|connections_max_idle_ms|connection_timeout|connect_retry_interval|connect_timeout|consumer_group|consumer_key|consumer_secret|consumer_threads|contenttype|content_type|context|conversion_method|convert|convert_datatype|convert_timestamp|cookies|copy|count|counter|create_if_deleted|create_subscription|csv_options|csv_schema|custom_fields|custom_headers|database|data_points|dataset|data_timeout|data_type|date_happened|date_pattern|db|dd_tags|debug|decimal_separator|decorate_events|decrement|default_database_type|default_hash|default_keys|delay_threshold_secs|delete|deleter_interval_secs|delimiter|description|destination|details|device|dictionary|dictionary_path|dimensions|dir_mode|discover_interval|dlq|dns_reverse_lookup_enabled|doc_as_upsert|docinfo|docinfo_fields|docinfo_target|document_id|document_type|domain|drop_invalid|drop_original_event|durable|eh_advanced_config|eh_basic_config|eh_config_models|emit_hosts|emit_ports|emit_scan_metadata|emit_traceroute_links|enable_auto_commit|enable_search|enable_sort|enable_ssl|encoding|end_of_task|endpoint|end_tag|end_time|engine|environment|error_directory|error_file|event_hub_connection|event_hub_connections|event_hubs|eventstatus|event_type|every|exact|example1|example2|example3|example4|example5|examples|exchange|exchange_type|exclude|exclude_fields|exclude_internal_topics|exclude_keys|exclude_metrics|exclude_pattern|exclude_tables|exclusive|expunge|facility|facility_labels|factory|failed_cache_size|failed_cache_ttl|failure_type_logging_whitelist|fallback|fetch_count|fetch_max_bytes|fetch_max_wait_ms|fetch_min_bytes|field|field_dimensions|field_metricname|field_namespace|fields|fields_are_metrics|field_split|field_split_pattern|field_unit|field_value|file_chunk_count|file_chunk_size|file_completed_action|file_completed_log_path|file_mode|filename_failure|file_sort_by|file_sort_direction|filters|fixed_version_id|flush_interval|flush_interval_secs|flush_size|folder|follow_redirects|follows|force_array|force_content|force_unlink|format|from|full_message|full_tweet|gauge|generateId|get|get_stats|grok_pattern|group|groupid|group_id|gsub|gzip|hash_bytes_used|headers|healthcheck_path|heartbeat|heartbeat_interval_ms|hit_cache_size|hit_cache_ttl|host|hosts|hostsfile|howitworks|htmlbody|http_compression|http_method|id_field|idle_flush_time|ignorable_codes|ignore_attachments|ignore_metadata|ignore_older|ignore_older_than|ignore_retweets|ignore_unknown_values|ilm|ilm_enabled|ilm_pattern|ilm_policy|ilm_rollover_alias|import|inactivity_timeout|incident_key|include_body|include_brackets|include_codec_tag|include_flowset_id|include_header|include_keys|include_metadata|include_metrics|include_object_properties|include_path|include_properties|increment|index|indices|init|initial_delay|initial_position|initial_position_look_back|initial_sequence|integration|interpolate|interval|ip|ipfix_definitions|isodate|iterate_on|iv_random_length|jaas_path|jdbc_connection_string|jdbc_default_timezone|jdbc_driver_class|jdbc_driver_library|jdbc_fetch_size|jdbc_page_size|jdbc_paging_enabled|jdbc_password|jdbc_password_filepath|jdbc_pool_timeout|jdbc_user|jdbc_validate_connection|jdbc_validation_timeout|jndi_context|jndi_name|join|json_key_file|json_schema|keepalive|keep_empty_captures|keep_id|keep_revision|keep_start_event|kerberos_config|kerberos_keytab|key|key_deserializer_class|key_name|key_pad|key_password|key_path|keys|key_serializer|key_size|keystore|keystore_password|keystore_type|keywords|kinesis_stream_name|languages|last_run_metadata_path|length_bytes|level|lifetime|lines|linger_ms|loaders|loader_schedule|local_db_objects|locale|local_lookups|locations|lowercase|lowercase_column_names|lowercase_headers|lru_cache_size|manage_template|map_action|map_fields|mapping|match|max_age|max_batch_size|max_bytes|max_cipher_reuse|max_content_length|max_counters|max_event_size|max_interval|max_lines|max_messages|max_open_files|max_partition_fetch_bytes|max_payload_size|max_pending_requests|max_poll_interval_ms|max_poll_records|max_request_size|max_retries|md5_field|measurement|meetupkey|merge|message|message_count_threshold|message_format|message_key|message_max_size|message_properties|messages_per_second|metadata|metadata_enabled|metadata_fetch_timeout_ms|metadata_max_age_ms|metadata_target|meter|method|metric|metric_field_name|metricname|metric_name|metrics|metrics_format|metric_type|metric_value|mib_paths|mode|msgid|multiline_tag|multi_value|nagios_host|nagios_level|nagios_service|nagios_status|name|named_captures_only|nameserver|namespace|namespaces|nan_handling|nan_tag|nan_value|nb_thread|negate|nested|nested_object_separator|netflow_definitions|network|network_path|new_event_on_match|nick|nodes|oauth_token|oauth_token_secret|object_order|oid_root_skip|open_timeout|options|org_id|override|overwrite|parameters|parent|parent_issue_id|partition_assignment_strategy|passive|password|path|pattern|pattern_definitions|patterns_dir|patterns_files_glob|pdurl|percentage|percentiles|period|persistent|pipeline|pipeline_id|polling_frequency|poll_timeout_ms|pool_max|pool_max_per_route|port|port_tcp|port_udp|post_string|prefetch_count|prefix|pre_string|priority|priority_id|private_key|priv_pass|priv_protocol|procid|proc_order|product|profile|project_id|proto|protocol|proxy|proxy_address|proxy_host|proxy_password|proxy_port|proxy_protocol|proxy_uri|proxy_user|prune_intervals|public_key|publish_boot_message_arn|pub_sub|push_map_as_event_on_timeout|push_previous_map_as_event|query|query_template|queue|queue_owner_aws_account_id|queue_size|quiet|quote_char|ranges|rate_limit_reset_in|rates|read_timeout|real|receive_buffer_bytes|reconnect|reconnect_backoff_ms|reconnect_delay|reconnect_interval|record_last_run|recursive|refresh_behaviour|refresh_interval|regex|regexes|region|remap|remote_host_target_field|remove_char_key|remove_char_value|remove_namespaces|rename|replace|replay|replyto|request_byte_threshold|request_headers_target_field|request_timeout|request_timeout_ms|require_jars|resend_on_failure|resolve|response_headers|restore|result_size|resurrect_delay|retention_policy|retries|retryable_codes|retry_backoff_ms|retry_count|retry_delay|retry_failed|retry_initial_interval|retry_interval|retry_known_errors|retry_max_interval|retry_non_idempotent|retry_on_conflict|retry_times|reverse|reverse_mapping|rfc|riemann_event|role_arn|role_session_name|rooms|rotation_strategy|routing|runner|sample_rate|sasl_kerberos_service_name|sasl_mechanism|schedule|schema_uri|script|scripted_upsert|script_lang|script_params|script_type|script_var_name|scroll|secret_access_key|secret_token|secure|security_level|security_name|security_protocol|security_token|selector|send_as_tags|send_buffer_bytes|sender|send_nsca_bin|send_nsca_config|sent_timestamp_field|separator|sequel_opts|sequence_path|server_side_encryption|server_side_encryption_algorithm|service_account|service_key|session_timeout_ms|session_token|set|sev_alert|sev_critical|sev_debug|sev_emergency|severity|severity_labels|sev_error|sev_info|sev_notice|sev_warning|sfdc_fields|sfdc_filters|sfdc_object_name|ship_metadata|ship_tags|short_message|shuffle_hosts|signature|signature_version|sincedb_clean_after|sincedb_path|sincedb_write_interval|single_file_per_thread|size|size_file|skip_empty_columns|skip_empty_rows|skip_header|skip_invalid_rows|skip_on_invalid_json|slope|snappy_bufsize|snappy_format|sniffing|sniffing_delay|sniffing_path|socket_not_present_retry_interval_seconds|socket_timeout|solr_url|sort|source|sourcehost|source_ip_fieldname|source_type_name|split|spreadsheet_safe|sql_log_level|ssekms_key_id|ssl|ssl_cacert|ssl_cert|ssl_certificate|ssl_certificate_authorities|ssl_certificate_password|ssl_certificate_path|ssl_certificate_validation|ssl_certificate_verification|ssl_enable|ssl_endpoint_identification_algorithm|ssl_extra_chain_certs|ssl_handshake_timeout|ssl_key|ssl_key_passphrase|ssl_key_password|ssl_keystore_location|ssl_keystore_password|ssl_keystore_type|ssl_opts|ssl_peer_metadata|ssl_truststore_location|ssl_truststore_password|ssl_truststore_type|ssl_verify|ssl_verify_mode|ssl_version|staging_directory|standby_host|standby_port|start_position|start_tag|start_time|start_timestamp|statement|statement_filepath|stat_interval|statistics|stats_interval|status_id|storage_class|storage_connection|storage_container|store_xml|stream_identity|string_duration|strip|strip_attachments|strip_leading_underscore|subject|subscription|subscription_retry_interval_seconds|suppress_empty|syslog_field|syslog_pri_field_name|table_prefix|table_separator|tag|tag_on_default_use|tag_on_exception|tag_on_failure|tag_on_timeout|target|target_body|target_headers|task_id|tcp_keep_alive|temp_directory|temp_file_prefix|template|template_file|template_name|template_overwrite|temporary_directory|terminator|text|threads|time|time_file|timeframe|timeout|timeout_code|timeout_millis|timeout_tags|timeout_task_id_field|timeout_timestamp_field|time_precision|timer|timestamp_destination|timestamp_field|timezone|timing|title|tls_max_version|tls_min_version|to|token|topic|topic_id|topics|topics_pattern|to_underscores|tracker_id|tracking_column|tracking_column_type|transform_key|transform_value|transliterate|trim_key|trim_value|truststore|truststore_password|truststore_type|ttl|typesdb|uniform|unique_id_field|unit|units|update|uploader_interval_secs|upload_queue_size|upload_workers_count|uppercase|upsert|uri|url|urlname|urls|use_cache|usecases|use_column_value|use_event_fields_for_data_points|use_httpfs|use_jms_timestamp|use_kerberos_auth|use_labels|use_proxy|user|username|users|use_samples|use_ssl|use_ssl_auth|use_tcp|use_test_sandbox|use_tls|use_udp|validate_after_inactivity|validate_credentials_on_root_bucket|value|value_deserializer_class|value_field_name|value_serializer|value_split|value_split_pattern|vendor|venueid|verb|verify_cert|verify_mode|version|versioned|versions|version_type|vhost|via|walk|watch_for_new_files|what|whitelist_names|whitelist_values|whitespace|workers|write_behavior|xpath|yaml_file|yamlmibdir|yaml_section|zabbix_host|zabbix_key|zabbix_server_host|zabbix_server_port|zabbix_value",
        h = function() {
            var e = "input|filter|output|codecs|" + logstash_plugins_list + logstash_filter_common_options + logstash_options_all,
                t = "and|else|elsif|if|in|not|or|xor|nand",
                n = "True|False|true|false|" + logstash_grok_patterns,
                r = "",
                i = this.$keywords = this.createKeywordMapper({
                    keyword: t,
                    "constant.language": n,
                    "variable.language": r,
                    "support.function": e,
                    "invalid.deprecated": "debugger"
                }, "identifier");
            this.$rules = {
                start: [{
                        token: "comment",
                        regex: "#.*$"
                    }, {
                        token: "comment",
                        regex: "^=begin(?:$|\\s.*$)",
                        next: "comment"
                    }, {
                        token: "string.regexp",
                        regex: "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)"
                    },
                    [{
                        regex: "[{}]",
                        onMatch: function(e, t, n) {
                            this.next = e == "{" ? this.nextState : "";
                            if (e == "{" && n.length) return n.unshift("start", t), "paren.lparen";
                            if (e == "}" && n.length) {
                                n.shift(), this.next = n.shift();
                                if (this.next.indexOf("string") != -1) return "paren.end"
                            }
                            return e == "{" ? "paren.lparen" : "paren.rparen"
                        },
                        nextState: "start"
                    }, {
                        token: "string.start",
                        regex: /"/,
                        push: [{
                            token: "constant.language.escape",
                            regex: /\\(?:[nsrtvfbae'"\\]|c.|C-.|M-.(?:\\C-.)?|[0-7]{3}|x[\da-fA-F]{2}|u[\da-fA-F]{4})/
                        },{
                            token: ["string", "keyword.type", "string", "constant.language.boolean", "string"],
                            regex: "(%{)([a-zA-Z0-9_]+)(:)([@a-zA-Z0-9_]+)(})"
                        },{
                            token: ["string", "keyword.type", "string"],
                            regex: "(%{)([A-Z0-9_]+)(})"
                        },{
                            token: ["string", "constant.language.boolean", "string"],
                            regex: "(\\(\\?<)([^>]+)(>)"
                        },{
                            // event.set(\"myEventField\"
                            token: ["string", "constant.language.boolean", "string"],
                            regex: /(event\.(?:get|set)\(\\")([^"]+)(\\")/
                        },{
                            // event.set('myEventField'
                            token: ["string", "constant.language.boolean", "string"],
                            regex: /(event\.(?:get|set)\(')([^']+)(')/
                        },{
                            token: "constant.language.boolean",
                            regex: "(%{)([?+&]?[@a-zA-Z0-9_]+(/\\d+)?)(})"
                        },{
                            token: "keyword.type",
                            regex: "(integer_eu|integer|float_eu|float|string|boolean|int)",
                        },{
                            token: ["string", "constant.language.boolean", "string"],
                            regex: "(\\[)([@a-zA-Z_0-9]+)(\\])",
                        },{
                            token: ["support.class"],
                            regex: "\\${[_a-zA-Z]+}"
                        },{
                            token: "string.end",
                            regex: /"/,
                            next: "pop"
                        }, {
                            defaultToken: "string"
                        }]
                    }, {
                        token: "string.start",
                        regex: /'/,
                        push: [{
                            token: "constant.language.escape",
                            regex: /\\(?:[nsrtvfbae'"\\]|c.|C-.|M-.(?:\\C-.)?|[0-7]{3}|x[\da-fA-F]{2}|u[\da-fA-F]{4})/
                        },{
                            token: ["string", "support.class", "string", "constant.language.boolean", "string"],
                            regex: "(%{)([a-zA-Z0-9_]+)(:)([@a-zA-Z0-9_]+)(})"
                        },{
                            token: ["string", "support.class", "string"],
                            regex: "(%{)([A-Z0-9_]+)(})"
                        },{
                            token: ["string", "constant.language.boolean", "string"],
                            regex: "(\\(\\?<)([^>]+)(>)"
                        },{
                            // event.set("myEventField"
                            token: ["string", "constant.language.boolean", "string"],
                            regex: /(event\.(?:get|set)\(")([^"]+)(")/
                        },{
                            // event.set(\'myEventField\'
                            token: ["string", "constant.language.boolean", "string"],
                            regex: /(event\.(?:get|set)\(\\')([^']+)(\\')/
                        },{
                            token: "constant.language.boolean",
                            regex: "(%{)([?+&]?[@a-zA-Z0-9_]+(/\\d+)?)(})"
                        },{
                            token: "support.class",
                            regex: "(integer_eu|integer|float_eu|float|string|boolean|int)",
                        },{
                            token: ["string", "constant.language.boolean", "string"],
                            regex: "(\\[)([@a-zA-Z_0-9]+)(\\])",
                        },{
                            token: ["support.class"],
                            regex: "\\${[_a-zA-Z]+}"
                        },{
                            token: "string.end",
                            regex: /'/,
                            next: "pop"
                        }, {
                            defaultToken: "string"
                        }]
                    }], {
                        token: "text",
                        regex: "::"
                    }, {
                        token: "variable.instance",
                        regex: "@{1,2}[a-zA-Z_\\d]+|\[[a-zA-Z_.]+\]"
                    }, {
                        token: "support.class",
                        regex: "[A-Z][a-zA-Z_\\d]+"
                    },
                    s, f, l, {
                        token: "constant.language.boolean",
                        regex: "(?:true|false)\\b"
                    }, {
                        token: i,
                        regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                    }, {
                        stateName: "heredoc",
                        onMatch: function(e, t, n) {
                            var r = e[2] == "-" ? "indentedHeredoc" : "heredoc",
                                i = e.split(this.splitRegex);
                            return n.push(r, i[3]), [{
                                type: "constant",
                                value: i[1]
                            }, {
                                type: "string",
                                value: i[2]
                            }, {
                                type: "support.class",
                                value: i[3]
                            }, {
                                type: "string",
                                value: i[4]
                            }, {
                                type: "keyword",
                                value: i[5]
                            }]
                        },
                        regex: "(<<-?)(['\"`]?)([\\w]+)(['\"`]?)",
                        rules: {
                            heredoc: [{
                                onMatch: function(e, t, n) {
                                    return e === n[1] ? (n.shift(), n.shift(), this.next = n[0] || "start", "support.class") : (this.next = "", "string")
                                },
                                regex: ".*$",
                                next: "start"
                            }],
                            indentedHeredoc: [{
                                token: "string",
                                regex: "^ +"
                            }, {
                                onMatch: function(e, t, n) {
                                    return e === n[1] ? (n.shift(), n.shift(), this.next = n[0] || "start", "support.class") : (this.next = "", "string")
                                },
                                regex: ".*$",
                                next: "start"
                            }]
                        }
                    }, {
                        regex: "$",
                        token: "empty",
                        next: function(e, t) {
                            return t[0] === "heredoc" || t[0] === "indentedHeredoc" ? t[0] : e
                        }
                    }, {
                        token: "string.character",
                        regex: "\\B\\?."
                    }, {
                        token: "keyword.operator",
                        regex: "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|=>|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)"
                    }, {
                        token: "paren.lparen",
                        regex: "[[({]"
                    }, {
                        token: "paren.rparen",
                        regex: "[\\])}]"
                    }, {
                        token: "text",
                        regex: "\\s+"
                    }
                ],
                comment: [{
                    token: "comment",
                    regex: "^=end(?:$|\\s.*$)",
                    next: "start"
                }, {
                    token: "comment",
                    regex: ".+"
                }]
            }, this.normalizeRules()
        };
    r.inherits(h, i), t.LogstashHighlightRules = h
}), ace.define("ace/mode/matching_brace_outdent", ["require", "exports", "module", "ace/range"], function(e, t, n) {
    "use strict";
    var r = e("../range").Range,
        i = function() {};
    (function() {
        this.checkOutdent = function(e, t) {
            return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1
        }, this.autoOutdent = function(e, t) {
            var n = e.getLine(t),
                i = n.match(/^(\s*\})/);
            if (!i) return 0;
            var s = i[1].length,
                o = e.findMatchingBracket({
                    row: t,
                    column: s
                });
            if (!o || o.row == t) return 0;
            var u = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, s - 1), u)
        }, this.$getIndent = function(e) {
            return e.match(/^\s*/)[0]
        }
    }).call(i.prototype), t.MatchingBraceOutdent = i
}), ace.define("ace/mode/folding/coffee", ["require", "exports", "module", "ace/lib/oop", "ace/mode/folding/fold_mode", "ace/range"], function(e, t, n) {
    "use strict";
    var r = e("../../lib/oop"),
        i = e("./fold_mode").FoldMode,
        s = e("../../range").Range,
        o = t.FoldMode = function() {};
    r.inherits(o, i),
        function() {
            this.getFoldWidgetRange = function(e, t, n) {
                var r = this.indentationBlock(e, n);
                if (r) return r;
                var i = /\S/,
                    o = e.getLine(n),
                    u = o.search(i);
                if (u == -1 || o[u] != "#") return;
                var a = o.length,
                    f = e.getLength(),
                    l = n,
                    c = n;
                while (++n < f) {
                    o = e.getLine(n);
                    var h = o.search(i);
                    if (h == -1) continue;
                    if (o[h] != "#") break;
                    c = n
                }
                if (c > l) {
                    var p = e.getLine(c).length;
                    return new s(l, a, c, p)
                }
            }, this.getFoldWidget = function(e, t, n) {
                var r = e.getLine(n),
                    i = r.search(/\S/),
                    s = e.getLine(n + 1),
                    o = e.getLine(n - 1),
                    u = o.search(/\S/),
                    a = s.search(/\S/);
                if (i == -1) return e.foldWidgets[n - 1] = u != -1 && u < a ? "start" : "", "";
                if (u == -1) {
                    if (i == a && r[i] == "#" && s[i] == "#") return e.foldWidgets[n - 1] = "", e.foldWidgets[n + 1] = "", "start"
                } else if (u == i && r[i] == "#" && o[i] == "#" && e.getLine(n - 2).search(/\S/) == -1) return e.foldWidgets[n - 1] = "start", e.foldWidgets[n + 1] = "", "";
                return u != -1 && u < i ? e.foldWidgets[n - 1] = "start" : e.foldWidgets[n - 1] = "", i < a ? "start" : ""
            }
        }.call(o.prototype)
}), ace.define("ace/mode/logstash", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text", "ace/mode/logstash_highlight_rules", "ace/mode/matching_brace_outdent", "ace/range", "ace/mode/behaviour/cstyle", "ace/mode/folding/coffee"], function(e, t, n) {
    "use strict";
    var r = e("../lib/oop"),
        i = e("./text").Mode,
        s = e("./logstash_highlight_rules").LogstashHighlightRules,
        o = e("./matching_brace_outdent").MatchingBraceOutdent,
        u = e("../range").Range,
        a = e("./behaviour/cstyle").CstyleBehaviour,
        f = e("./folding/coffee").FoldMode,
        l = function() {
            this.HighlightRules = s, this.$outdent = new o, this.$behaviour = new a, this.foldingRules = new f
        };
    r.inherits(l, i),
        function() {
            this.lineCommentStart = "#", this.getNextLineIndent = function(e, t, n) {
                var r = this.$getIndent(t),
                    i = this.getTokenizer().getLineTokens(t, e),
                    s = i.tokens;
                if (s.length && s[s.length - 1].type == "comment") return r;
                if (e == "start") {
                    var o = t.match(/^.*[\{\(\[]\s*$/),
                        u = t.match(/^\s*(class|def|module)\s.*$/),
                        a = t.match(/.*do(\s*|\s+\|.*\|\s*)$/),
                        f = t.match(/^\s*(if|else|when)\s*/);
                    if (o || u || a || f) r += n
                }
                return r
            }, this.checkOutdent = function(e, t, n) {
                return /^\s+(end|else)$/.test(t + n) || this.$outdent.checkOutdent(t, n)
            }, this.autoOutdent = function(e, t, n) {
                var r = t.getLine(n);
                if (/}/.test(r)) return this.$outdent.autoOutdent(t, n);
                var i = this.$getIndent(r),
                    s = t.getLine(n - 1),
                    o = this.$getIndent(s),
                    a = t.getTabString();
                o.length <= i.length && i.slice(-a.length) == a && t.remove(new u(n, i.length - a.length, n, i.length))
            }, this.$id = "ace/mode/logstash"
        }.call(l.prototype), t.Mode = l
});
(function() {                    ace.require(["ace/mode/logstash"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            