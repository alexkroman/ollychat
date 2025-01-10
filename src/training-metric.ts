export const metrics = [
    {
      metric: "alertmanager_alerts",
      description: "Tracks the number of alerts currently active, categorized by their state.",
      type: "gauge",
      unit: "",
      help: "How many alerts by state."
    },
    {
      metric: "alertmanager_alerts_invalid_total",
      description: "Counts the total number of alerts received that were deemed invalid.",
      type: "counter",
      unit: "",
      help: "The total number of received alerts that were invalid."
    },
    {
      metric: "alertmanager_alerts_received_total",
      description: "Tracks the cumulative number of alerts received by the system.",
      type: "counter",
      unit: "",
      help: "The total number of received alerts."
    },
    {
      metric: "alertmanager_build_info",
      description: "Provides build information about Alertmanager, including version, revision, and platform details.",
      type: "gauge",
      unit: "",
      help: "A metric with a constant '1' value labeled by version, revision, branch, goversion from which alertmanager was built, and the goos and goarch for the build."
    },
    {
      metric: "alertmanager_cluster_enabled",
      description: "Indicates whether clustering is currently enabled in Alertmanager.",
      type: "gauge",
      unit: "",
      help: "Indicates whether the clustering is enabled or not."
    },
    {
      metric: "alertmanager_config_hash",
      description: "Shows the hash value of the currently loaded Alertmanager configuration, useful for detecting changes.",
      type: "gauge",
      unit: "",
      help: "Hash of the currently loaded alertmanager configuration."
    },
    {
        metric: "alertmanager_config_last_reload_success_timestamp_seconds",
        description: "The timestamp of the last successful reload of the Alertmanager configuration.",
        type: "gauge",
        unit: "",
        help: "Timestamp of the last successful configuration reload."
      },
      {
        metric: "alertmanager_config_last_reload_successful",
        description: "Indicates if the most recent attempt to reload the Alertmanager configuration was successful.",
        type: "gauge",
        unit: "",
        help: "Whether the last configuration reload attempt was successful."
      },
      {
        metric: "alertmanager_dispatcher_aggregation_groups",
        description: "The number of active aggregation groups currently managed by the Alertmanager dispatcher.",
        type: "gauge",
        unit: "",
        help: "Number of active aggregation groups"
      },
      {
        metric: "alertmanager_dispatcher_alert_processing_duration_seconds",
        description: "Summary of the time taken to process alerts by the Alertmanager dispatcher.",
        type: "summary",
        unit: "",
        help: "Summary of latencies for the processing of alerts."
      },
      {
        metric: "alertmanager_http_concurrency_limit_exceeded_total",
        description: "The total number of HTTP requests that were rejected due to exceeding the concurrency limit.",
        type: "counter",
        unit: "",
        help: "Total number of times an HTTP request failed because the concurrency limit was reached."
      },
      {
        metric: "alertmanager_http_request_duration_seconds",
        description: "A histogram that represents the latency of HTTP requests handled by Alertmanager.",
        type: "histogram",
        unit: "",
        help: "Histogram of latencies for HTTP requests."
      },
      {
        metric: "alertmanager_http_requests_in_flight",
        description: "The current number of HTTP requests being processed simultaneously by Alertmanager.",
        type: "gauge",
        unit: "",
        help: "Current number of HTTP requests being processed."
      },
      {
        metric: "alertmanager_http_response_size_bytes",
        description: "A histogram that captures the size of HTTP responses sent by Alertmanager.",
        type: "histogram",
        unit: "",
        help: "Histogram of response size for HTTP requests."
      },
      {
        metric: "alertmanager_inhibition_rules",
        description: "The total number of inhibition rules currently configured in Alertmanager.",
        type: "gauge",
        unit: "",
        help: "Number of configured inhibition rules."
      },
      {
        metric: "alertmanager_integrations",
        description: "Number of configured integrations in the Alertmanager.",
        type: "gauge",
        unit: "",
        help: "Number of configured integrations."
      },
      {
        metric: "alertmanager_marked_alerts",
        description: "Current count of alerts marked by their state in the Alertmanager.",
        type: "gauge",
        unit: "",
        help: "How many alerts by state are currently marked in the Alertmanager regardless of their expiry."
      },
      {
        metric: "alertmanager_nflog_gc_duration_seconds",
        description: "Time taken for the last garbage collection cycle of the notification log.",
        type: "summary",
        unit: "",
        help: "Duration of the last notification log garbage collection cycle."
      },
      {
        metric: "alertmanager_nflog_gossip_messages_propagated_total",
        description: "Total number of received gossip messages that were propagated further.",
        type: "counter",
        unit: "",
        help: "Number of received gossip messages that have been further gossiped."
      },
      {
        metric: "alertmanager_nflog_maintenance_errors_total",
        description: "Count of notification log maintenance operations that failed.",
        type: "counter",
        unit: "",
        help: "How many maintenances were executed for the notification log that failed."
      },
      {
        metric: "alertmanager_nflog_maintenance_total",
        description: "Total number of notification log maintenance operations executed.",
        type: "counter",
        unit: "",
        help: "How many maintenances were executed for the notification log."
      },
      {
        metric: "alertmanager_nflog_queries_total",
        description: "Total count of notification log queries received.",
        type: "counter",
        unit: "",
        help: "Number of notification log queries were received."
      },
      {
        metric: "alertmanager_nflog_query_duration_seconds",
        description: "Duration of evaluating notification log queries.",
        type: "histogram",
        unit: "",
        help: "Duration of notification log query evaluation."
      },
      {
        metric: "alertmanager_nflog_query_errors_total",
        description: "Number of notification log queries that resulted in errors.",
        type: "counter",
        unit: "",
        help: "Number notification log received queries that failed."
      },
      {
        metric: "alertmanager_nflog_snapshot_duration_seconds",
        description: "Time taken to complete the last notification log snapshot.",
        type: "summary",
        unit: "",
        help: "Duration of the last notification log snapshot."
      },
      {
        metric: "alertmanager_nflog_snapshot_size_bytes",
        description: "Size in bytes of the last notification log snapshot.",
        type: "gauge",
        unit: "",
        help: "Size of the last notification log snapshot in bytes."
      },
      {
        metric: "alertmanager_notification_latency_seconds",
        description: "Measures the latency of sending notifications in Alertmanager, reported in seconds.",
        type: "histogram",
        unit: "",
        help: "The latency of notifications in seconds."
      },
      {
        metric: "alertmanager_notification_requests_failed_total",
        description: "Tracks the total number of notification requests that failed to send.",
        type: "counter",
        unit: "",
        help: "The total number of failed notification requests."
      },
      {
        metric: "alertmanager_notification_requests_total",
        description: "Tracks the total number of notification requests attempted by Alertmanager.",
        type: "counter",
        unit: "",
        help: "The total number of attempted notification requests."
      },
      {
        metric: "alertmanager_notifications_failed_total",
        description: "Counts the total number of notifications that failed to be delivered.",
        type: "counter",
        unit: "",
        help: "The total number of failed notifications."
      },
      {
        metric: "alertmanager_notifications_suppressed_total",
        description: "Tracks the total number of notifications suppressed due to being outside active intervals or within muted intervals.",
        type: "counter",
        unit: "",
        help: "The total number of notifications suppressed for being outside of active time intervals or within muted time intervals."
      },
      {
        metric: "alertmanager_notifications_total",
        description: "Counts the total number of notifications that were attempted by Alertmanager.",
        type: "counter",
        unit: "",
        help: "The total number of attempted notifications."
      },
      {
        metric: "alertmanager_receivers",
        description: "Reports the current number of configured notification receivers in Alertmanager.",
        type: "gauge",
        unit: "",
        help: "Number of configured receivers."
      },
      {
        metric: "alertmanager_silences",
        description: "Displays the count of silences by their state (e.g., active, pending, or expired).",
        type: "gauge",
        unit: "",
        help: "How many silences by state."
      },
      {
        metric: "alertmanager_silences_gc_duration_seconds",
        description: "Tracks the duration of the last silence garbage collection cycle in seconds.",
        type: "summary",
        unit: "",
        help: "Duration of the last silence garbage collection cycle."
      },
      {
        metric: "alertmanager_silences_gossip_messages_propagated_total",
        description: "Counts the number of received gossip messages that were further propagated.",
        type: "counter",
        unit: "",
        help: "Number of received gossip messages that have been further gossiped."
      },
      {
        metric: "alertmanager_silences_maintenance_errors_total",
        description: "Tracks how many maintenance operations for silences failed.",
        type: "counter",
        unit: "",
        help: "How many maintenances were executed for silences that failed."
      },
      {
        metric: "alertmanager_silences_maintenance_total",
        description: "Tracks the total number of maintenance operations executed for silences.",
        type: "counter",
        unit: "",
        help: "How many maintenances were executed for silences."
      },
      {
        metric: "alertmanager_silences_queries_total",
        description: "Counts the total number of silence queries received by Alertmanager.",
        type: "counter",
        unit: "",
        help: "How many silence queries were received."
      },
      {
        metric: "alertmanager_silences_query_duration_seconds",
        description: "Measures the duration of silence query evaluations in seconds.",
        type: "histogram",
        unit: "",
        help: "Duration of silence query evaluation."
      },
      {
        metric: "alertmanager_silences_query_errors_total",
        description: "Counts the number of silence queries that resulted in errors.",
        type: "counter",
        unit: "",
        help: "How many silence received queries did not succeed."
      },
      {
        metric: "alertmanager_silences_snapshot_duration_seconds",
        description: "Measures the duration of the last silence snapshot operation in seconds.",
        type: "summary",
        unit: "",
        help: "Duration of the last silence snapshot."
      },
      {
        metric: "alertmanager_silences_snapshot_size_bytes",
        description: "Reports the size of the last silence snapshot in bytes.",
        type: "gauge",
        unit: "",
        help: "Size of the last silence snapshot in bytes."
      },
      {
        metric: "caddy_admin_http_requests_total",
        description: "Counts the total number of HTTP requests made to the Admin API endpoints in Caddy.",
        type: "counter",
        unit: "",
        help: "Counter of requests made to the Admin API's HTTP endpoints."
      },
      {
        metric: "alertmanager_notification_latency_seconds",
        description: "The latency of notifications in seconds.",
        type: "histogram",
        unit: "",
        help: "The latency of notifications in seconds."
      },
      {
        metric: "alertmanager_notification_requests_failed_total",
        description: "The total number of failed notification requests.",
        type: "counter",
        unit: "",
        help: "The total number of failed notification requests."
      },
      {
        metric: "alertmanager_notification_requests_total",
        description: "The total number of attempted notification requests.",
        type: "counter",
        unit: "",
        help: "The total number of attempted notification requests."
      },
      {
        metric: "alertmanager_notifications_failed_total",
        description: "The total number of failed notifications.",
        type: "counter",
        unit: "",
        help: "The total number of failed notifications."
      },
      {
        metric: "alertmanager_notifications_suppressed_total",
        description: "The total number of notifications suppressed for being outside of active time intervals or within muted time intervals.",
        type: "counter",
        unit: "",
        help: "The total number of notifications suppressed for being outside of active time intervals or within muted time intervals."
      },
      {
        metric: "alertmanager_notifications_total",
        description: "The total number of attempted notifications.",
        type: "counter",
        unit: "",
        help: "The total number of attempted notifications."
      },
      {
        metric: "alertmanager_receivers",
        description: "Number of configured receivers.",
        type: "gauge",
        unit: "",
        help: "Number of configured receivers."
      },
      {
        metric: "alertmanager_silences",
        description: "How many silences by state.",
        type: "gauge",
        unit: "",
        help: "How many silences by state."
      },
      {
        metric: "alertmanager_silences_gc_duration_seconds",
        description: "Duration of the last silence garbage collection cycle.",
        type: "summary",
        unit: "",
        help: "Duration of the last silence garbage collection cycle."
      },
      {
        metric: "alertmanager_silences_gossip_messages_propagated_total",
        description: "Number of received gossip messages that have been further gossiped.",
        type: "counter",
        unit: "",
        help: "Number of received gossip messages that have been further gossiped."
      },
      {
        metric: "alertmanager_silences_maintenance_errors_total",
        description: "How many maintenances were executed for silences that failed.",
        type: "counter",
        unit: "",
        help: "How many maintenances were executed for silences that failed."
      },
      {
        metric: "alertmanager_silences_maintenance_total",
        description: "How many maintenances were executed for silences.",
        type: "counter",
        unit: "",
        help: "How many maintenances were executed for silences."
      },
      {
        metric: "alertmanager_silences_queries_total",
        description: "How many silence queries were received.",
        type: "counter",
        unit: "",
        help: "How many silence queries were received."
      },
      {
        metric: "alertmanager_silences_query_duration_seconds",
        description: "Duration of silence query evaluation.",
        type: "histogram",
        unit: "",
        help: "Duration of silence query evaluation."
      },
      {
        metric: "alertmanager_silences_query_errors_total",
        description: "How many silence received queries did not succeed.",
        type: "counter",
        unit: "",
        help: "How many silence received queries did not succeed."
      },
      {
        metric: "alertmanager_silences_snapshot_duration_seconds",
        description: "Duration of the last silence snapshot.",
        type: "summary",
        unit: "",
        help: "Duration of the last silence snapshot."
      },
      {
        metric: "alertmanager_silences_snapshot_size_bytes",
        description: "Size of the last silence snapshot in bytes.",
        type: "gauge",
        unit: "",
        help: "Size of the last silence snapshot in bytes."
      },
      {
        metric: "caddy_admin_http_requests_total",
        description: "Counter of requests made to the Admin API's HTTP endpoints.",
        type: "counter",
        unit: "",
        help: "Counter of requests made to the Admin API's HTTP endpoints."
      },
      {
        metric: "caddy_config_last_reload_success_timestamp_seconds",
        description: "Timestamp of the last successful configuration reload.",
        type: "gauge",
        unit: "",
        help: "Timestamp of the last successful configuration reload."
      },
      {
        metric: "caddy_config_last_reload_successful",
        description: "Whether the last configuration reload attempt was successful.",
        type: "gauge",
        unit: "",
        help: "Whether the last configuration reload attempt was successful."
      },
      {
        metric: "caddy_http_request_duration_seconds",
        description: "Histogram of round-trip request durations.",
        type: "histogram",
        unit: "",
        help: "Histogram of round-trip request durations."
      },
      {
        metric: "caddy_http_request_errors_total",
        description: "Number of requests resulting in middleware errors.",
        type: "counter",
        unit: "",
        help: "Number of requests resulting in middleware errors."
      },
      {
        metric: "caddy_http_request_size_bytes",
        description: "Total size of the request. Includes body.",
        type: "histogram",
        unit: "",
        help: "Total size of the request. Includes body."
      },
      {
        metric: "caddy_http_requests_in_flight",
        description: "Number of requests currently handled by this server.",
        type: "gauge",
        unit: "",
        help: "Number of requests currently handled by this server."
      },
      {
        metric: "caddy_http_requests_total",
        description: "Counter of HTTP(S) requests made.",
        type: "counter",
        unit: "",
        help: "Counter of HTTP(S) requests made."
      },
      {
        metric: "caddy_http_response_duration_seconds",
        description: "Histogram of times to first byte in response bodies.",
        type: "histogram",
        unit: "",
        help: "Histogram of times to first byte in response bodies."
      },
      {
        metric: "caddy_http_response_size_bytes",
        description: "Size of the returned response.",
        type: "histogram",
        unit: "",
        help: "Size of the returned response."
      },
      {
        metric: "cadvisor_version_info",
        description: "A metric with a constant '1' value labeled by kernel version, OS version, docker version, cadvisor version & cadvisor revision.",
        type: "gauge",
        unit: "",
        help: "A metric with a constant '1' value labeled by kernel version, OS version, docker version, cadvisor version & cadvisor revision."
      },
      {
        metric: "container_blkio_device_usage_total",
        description: "Blkio Device bytes usage.",
        type: "counter",
        unit: "",
        help: "Blkio Device bytes usage."
      },
      {
        metric: "container_cpu_load_average_10s",
        description: "Value of container CPU load average over the last 10 seconds.",
        type: "gauge",
        unit: "",
        help: "Value of container CPU load average over the last 10 seconds."
      },
      {
        metric: "container_cpu_system_seconds_total",
        description: "Cumulative system CPU time consumed in seconds.",
        type: "counter",
        unit: "",
        help: "Cumulative system CPU time consumed in seconds."
      },
      {
        metric: "container_cpu_usage_seconds_total",
        description: "Cumulative CPU time consumed in seconds.",
        type: "counter",
        unit: "",
        help: "Cumulative CPU time consumed in seconds."
      },
      {
        metric: "container_cpu_user_seconds_total",
        description: "Cumulative user CPU time consumed in seconds.",
        type: "counter",
        unit: "",
        help: "Cumulative user CPU time consumed in seconds."
      },
      {
        metric: "container_fs_inodes_free",
        description: "Number of available inodes.",
        type: "gauge",
        unit: "",
        help: "Number of available inodes."
      },
      {
        metric: "container_fs_inodes_total",
        description: "Number of inodes.",
        type: "gauge",
        unit: "",
        help: "Number of inodes."
      },
      {
        metric: "container_fs_io_current",
        description: "Number of I/Os currently in progress.",
        type: "gauge",
        unit: "",
        help: "Number of I/Os currently in progress."
      },
      {
        metric: "container_fs_io_time_seconds_total",
        description: "Cumulative count of seconds spent doing I/Os.",
        type: "counter",
        unit: "",
        help: "Cumulative count of seconds spent doing I/Os."
      },
      {
        metric: "container_fs_io_time_weighted_seconds_total",
        description: "Cumulative weighted I/O time in seconds.",
        type: "counter",
        unit: "",
        help: "Cumulative weighted I/O time in seconds."
      },
      {
        metric: "container_fs_limit_bytes",
        description: "Number of bytes that can be consumed by the container on this filesystem.",
        type: "gauge",
        unit: "",
        help: "Number of bytes that can be consumed by the container on this filesystem."
      },
      {
        metric: "container_fs_read_seconds_total",
        description: "Cumulative count of seconds spent reading.",
        type: "counter",
        unit: "",
        help: "Cumulative count of seconds spent reading."
      },
      {
        metric: "container_fs_reads_bytes_total",
        description: "Cumulative count of bytes read.",
        type: "counter",
        unit: "",
        help: "Cumulative count of bytes read."
      },
      {
        metric: "container_fs_reads_merged_total",
        description: "Cumulative count of reads merged.",
        type: "counter",
        unit: "",
        help: "Cumulative count of reads merged."
      },
      {
        metric: "container_fs_reads_total",
        description: "Cumulative count of reads completed.",
        type: "counter",
        unit: "",
        help: "Cumulative count of reads completed."
      },
      {
        metric: "container_fs_sector_reads_total",
        description: "Cumulative count of sector reads completed.",
        type: "counter",
        unit: "",
        help: "Cumulative count of sector reads completed."
      },
      {
        metric: "container_fs_sector_writes_total",
        description: "Cumulative count of sector writes completed.",
        type: "counter",
        unit: "",
        help: "Cumulative count of sector writes completed."
      },
      {
        metric: "container_fs_usage_bytes",
        description: "Number of bytes that are consumed by the container on this filesystem.",
        type: "gauge",
        unit: "",
        help: "Number of bytes that are consumed by the container on this filesystem."
      },
      {
        metric: "container_fs_write_seconds_total",
        description: "Cumulative count of seconds spent writing.",
        type: "counter",
        unit: "",
        help: "Cumulative count of seconds spent writing."
      },
      {
        metric: "container_fs_writes_bytes_total",
        description: "Cumulative count of bytes written.",
        type: "counter",
        unit: "",
        help: "Cumulative count of bytes written."
      },
      {
        metric: "container_fs_writes_merged_total",
        description: "Cumulative count of writes merged.",
        type: "counter",
        unit: "",
        help: "Cumulative count of writes merged."
      },
      {
        metric: "container_fs_writes_total",
        description: "Cumulative count of writes completed to the container's filesystem.",
        type: "counter",
        unit: "",
        help: "Cumulative count of writes completed"
      },
      {
        metric: "container_last_seen",
        description: "Timestamp of the last time the container was seen by the Prometheus exporter.",
        type: "gauge",
        unit: "",
        help: "Last time a container was seen by the exporter"
      },
      {
        metric: "container_memory_cache",
        description: "Amount of page cache memory used by the container, measured in bytes.",
        type: "gauge",
        unit: "",
        help: "Number of bytes of page cache memory."
      },
      {
        metric: "container_memory_failcnt",
        description: "Number of times the container's memory usage hit its limits.",
        type: "counter",
        unit: "",
        help: "Number of memory usage hits limits"
      },
      {
        metric: "container_memory_failures_total",
        description: "Total count of memory allocation failures for the container.",
        type: "counter",
        unit: "",
        help: "Cumulative count of memory allocation failures."
      },
      {
        metric: "container_memory_kernel_usage",
        description: "Amount of kernel memory allocated by the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Size of kernel memory allocated in bytes."
      },
      {
        metric: "container_memory_mapped_file",
        description: "Size of memory-mapped files used by the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Size of memory mapped files in bytes."
      },
      {
        metric: "container_memory_max_usage_bytes",
        description: "Maximum memory usage recorded for the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Maximum memory usage recorded in bytes"
      },
      {
        metric: "container_memory_rss",
        description: "Resident Set Size (RSS) memory usage of the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Size of RSS in bytes."
      },
      {
        metric: "container_memory_swap",
        description: "Amount of swap memory used by the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Container swap usage in bytes."
      },
      {
        metric: "container_memory_usage_bytes",
        description: "Current total memory usage of the container, including all accessed and non-accessed memory, in bytes.",
        type: "gauge",
        unit: "",
        help: "Current memory usage in bytes, including all memory regardless of when it was accessed"
      },
      {
        metric: "container_memory_working_set_bytes",
        description: "Size of the working set memory of the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Current working set in bytes."
      },
      {
        metric: "container_network_receive_bytes_total",
        description: "Total number of bytes received by the container's network interface.",
        type: "counter",
        unit: "",
        help: "Cumulative count of bytes received"
      },
      {
        metric: "container_network_receive_errors_total",
        description: "Total number of errors encountered while receiving data on the container's network interface.",
        type: "counter",
        unit: "",
        help: "Cumulative count of errors encountered while receiving"
      },
      {
        metric: "container_network_receive_packets_dropped_total",
        description: "Total number of packets dropped while receiving data on the container's network interface.",
        type: "counter",
        unit: "",
        help: "Cumulative count of packets dropped while receiving"
      },
      {
        metric: "container_network_receive_packets_total",
        description: "Total number of packets received on the container's network interface.",
        type: "counter",
        unit: "",
        help: "Cumulative count of packets received"
      },
      {
        metric: "container_network_transmit_bytes_total",
        description: "Total number of bytes transmitted by the container's network interface.",
        type: "counter",
        unit: "",
        help: "Cumulative count of bytes transmitted"
      },
      {
        metric: "container_network_transmit_errors_total",
        description: "Total number of errors encountered while transmitting data on the container's network interface.",
        type: "counter",
        unit: "",
        help: "Cumulative count of errors encountered while transmitting"
      },
      {
        metric: "container_network_transmit_packets_dropped_total",
        description: "Total number of packets dropped while transmitting data on the container's network interface.",
        type: "counter",
        unit: "",
        help: "Cumulative count of packets dropped while transmitting"
      },
      {
        metric: "container_network_transmit_packets_total",
        description: "Total number of packets transmitted on the container's network interface.",
        type: "counter",
        unit: "",
        help: "Cumulative count of packets transmitted"
      },
      {
        metric: "container_oom_events_total",
        description: "Total number of out-of-memory (OOM) events observed for the container.",
        type: "counter",
        unit: "",
        help: "Count of out of memory events observed for the container"
      },
      {
        metric: "container_scrape_error",
        description: "Indicates if there was an error while scraping container metrics. A value of 1 means an error occurred; 0 means no error.",
        type: "gauge",
        unit: "",
        help: "1 if there was an error while getting container metrics, 0 otherwise"
      },
      {
        metric: "container_spec_cpu_period",
        description: "CPU period configuration for the container.",
        type: "gauge",
        unit: "",
        help: "CPU period of the container."
      },
      {
        metric: "container_spec_cpu_shares",
        description: "CPU shares assigned to the container.",
        type: "gauge",
        unit: "",
        help: "CPU share of the container."
      },
      {
        metric: "container_spec_memory_limit_bytes",
        description: "Memory limit set for the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Memory limit for the container."
      },
      {
        metric: "container_spec_memory_reservation_limit_bytes",
        description: "Memory reservation limit set for the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Memory reservation limit for the container."
      },
      {
        metric: "container_spec_memory_swap_limit_bytes",
        description: "Swap memory limit set for the container, in bytes.",
        type: "gauge",
        unit: "",
        help: "Memory swap limit for the container."
      },
      {
        metric: "container_start_time_seconds",
        description: "Start time of the container since Unix epoch, measured in seconds.",
        type: "gauge",
        unit: "",
        help: "Start time of the container since unix epoch in seconds."
      },
      {
        metric: "container_tasks_state",
        description: "Number of tasks in a specific state for the container.",
        type: "gauge",
        unit: "",
        help: "Number of tasks in given state"
      },
      {
        metric: "deprecated_flags_inuse",
        description: "Number of deprecated flags currently in use.",
        type: "counter",
        unit: "",
        help: "The number of deprecated flags currently set."
      },
      {
        metric: "go_build_info",
        description: "Information about the build of the main Go module.",
        type: "gauge",
        unit: "",
        help: "Build information about the main Go module."
      },
      {
        metric: "go_cgo_go_to_c_calls_calls",
        description: "Total number of calls made from Go to C by the current process.",
        type: "counter",
        unit: "",
        help: "Count of calls made from Go to C by the current process. Sourced from /cgo/go-to-c-calls:calls"
      },
      {
        metric: "go_cpu_classes_gc_mark_assist_cpu_seconds",
        description: "Estimated total CPU time spent by goroutines assisting with garbage collection (GC) tasks.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time goroutines spent performing GC tasks to assist the GC and prevent it from falling behind the application. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sourced from /cpu/classes/gc/mark/assist:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_gc_mark_dedicated_cpu_seconds",
        description: "Estimated total CPU time spent performing GC tasks on dedicated processors.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent performing GC tasks on processors (as defined by GOMAXPROCS) dedicated to those tasks. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sourced from /cpu/classes/gc/mark/dedicated:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_gc_mark_idle_cpu_seconds",
        description: "Estimated total CPU time spent on GC tasks using idle CPU resources.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent performing GC tasks on spare CPU resources that the Go scheduler could not otherwise find a use for. This should be subtracted from the total GC CPU time to obtain a measure of compulsory GC CPU time. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sourced from /cpu/classes/gc/mark/idle:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_gc_pause_cpu_seconds",
        description: "Estimated total CPU time spent on GC pause events.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent on GC pause events."
      },
      {
        metric: "go_cpu_classes_gc_pause_cpu_seconds",
        description: "Estimated total CPU time spent with the application paused by the GC. Computed as GOMAXPROCS times the pause latency. Overestimate, not directly comparable to system CPU time measurements.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent with the application paused by the GC. Even if only one thread is running during the pause, this is computed as GOMAXPROCS times the pause latency because nothing else can be executing. This is the exact sum of samples in /sched/pauses/total/gc:seconds if each sample is multiplied by GOMAXPROCS at the time it is taken. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sourced from /cpu/classes/gc/pause:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_gc_total_cpu_seconds",
        description: "Estimated total CPU time spent performing GC tasks. Overestimate, not directly comparable to system CPU time measurements.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent performing GC tasks. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sum of all metrics in /cpu/classes/gc. Sourced from /cpu/classes/gc/total:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_idle_cpu_seconds",
        description: "Estimated total available CPU time not spent executing any Go or Go runtime code. Overestimate, not directly comparable to system CPU time measurements.",
        type: "counter",
        unit: "",
        help: "Estimated total available CPU time not spent executing any Go or Go runtime code. In other words, the part of /cpu/classes/total:cpu-seconds that was unused. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sourced from /cpu/classes/idle:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_scavenge_assist_cpu_seconds",
        description: "Estimated total CPU time spent returning unused memory to the underlying platform in response to memory pressure. Overestimate, not directly comparable to system CPU time measurements.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent returning unused memory to the underlying platform in response eagerly in response to memory pressure. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sourced from /cpu/classes/scavenge/assist:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_scavenge_background_cpu_seconds",
        description: "Estimated total CPU time spent performing background tasks to return unused memory to the underlying platform. Overestimate, not directly comparable to system CPU time measurements.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent performing background tasks to return unused memory to the underlying platform. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sourced from /cpu/classes/scavenge/background:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_scavenge_total_cpu_seconds",
        description: "Estimated total CPU time spent performing tasks that return unused memory to the underlying platform. Overestimate, not directly comparable to system CPU time measurements.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent performing tasks that return unused memory to the underlying platform. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sum of all metrics in /cpu/classes/scavenge. Sourced from /cpu/classes/scavenge/total:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_total_cpu_seconds",
        description: "Estimated total available CPU time for user Go code or the Go runtime. Overestimate, not directly comparable to system CPU time measurements.",
        type: "counter",
        unit: "",
        help: "Estimated total available CPU time for user Go code or the Go runtime, as defined by GOMAXPROCS. In other words, GOMAXPROCS integrated over the wall-clock duration this process has been executing for. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sum of all metrics in /cpu/classes. Sourced from /cpu/classes/total:cpu-seconds"
      },
      {
        metric: "go_cpu_classes_user_cpu_seconds",
        description: "Estimated total CPU time spent running user Go code. May include some runtime time. Overestimate, not directly comparable to system CPU time measurements.",
        type: "counter",
        unit: "",
        help: "Estimated total CPU time spent running user Go code. This may also include some small amount of time spent in the Go runtime. This metric is an overestimate, and not directly comparable to system CPU time measurements. Compare only with other /cpu/classes metrics. Sourced from /cpu/classes/user:cpu-seconds"
      },
      {
        metric: "go_gc_cycles_automatic_gc_cycles",
        description: "Count of completed GC cycles generated by the Go runtime.",
        type: "counter",
        unit: "",
        help: "Count of completed GC cycles generated by the Go runtime. Sourced from /gc/cycles/automatic:gc-cycles"
      },
      {
        metric: "go_gc_cycles_automatic_gc_cycles_total",
        description: "Count of completed GC cycles generated by the Go runtime.",
        type: "counter",
        unit: "",
        help: "Count of completed GC cycles generated by the Go runtime. Sourced from /gc/cycles/automatic:gc-cycles"
      },
      {
        metric: "go_gc_cycles_forced_gc_cycles",
        description: "Count of completed GC cycles forced by the application.",
        type: "counter",
        unit: "",
        help: "Count of completed GC cycles forced by the application. Sourced from /gc/cycles/forced:gc-cycles"
      },
      {
        metric: "go_gc_cycles_forced_gc_cycles_total",
        description: "Count of completed GC cycles forced by the application.",
        type: "counter",
        unit: "",
        help: "Count of completed GC cycles forced by the application. Sourced from /gc/cycles/forced:gc-cycles"
      },
      {
        metric: "go_gc_cycles_total_gc_cycles",
        description: "Count of all completed GC cycles.",
        type: "counter",
        unit: "",
        help: "Count of all completed GC cycles. Sourced from /gc/cycles/total:gc-cycles"
      },
      {
        metric: "go_gc_cycles_total_gc_cycles_total",
        description: "Count of all completed GC cycles.",
        type: "counter",
        unit: "",
        help: "Count of all completed GC cycles. Sourced from /gc/cycles/total:gc-cycles"
      },
      {
        metric: "go_gc_duration_seconds",
        description: "A summary of the pause duration of garbage collection cycles.",
        type: "summary",
        unit: "",
        help: "A summary of the wall-time pause (stop-the-world) duration in garbage collection cycles."
      },
      {
        metric: "go_gc_gogc_percent",
        description: "Heap size target percentage configured by the user, otherwise 100.",
        type: "gauge",
        unit: "",
        help: "This value is set by the GOGC environment variable, and the runtime/debug.SetGCPercent function. Sourced from /gc/gogc:percent."
      },
      {
        metric: "go_gc_gomemlimit_bytes",
        description: "Go runtime memory limit configured by the user, otherwise math.MaxInt64.",
        type: "gauge",
        unit: "",
        help: "This value is set by the GOMEMLIMIT environment variable, and the runtime/debug.SetMemoryLimit function. Sourced from /gc/gomemlimit:bytes."
      },
      {
        metric: "go_gc_heap_allocs_by_size_bytes",
        description: "Distribution of heap allocations by approximate size.",
        type: "histogram",
        unit: "",
        help: "Bucket counts increase monotonically. Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks. Sourced from /gc/heap/allocs-by-size:bytes."
      },
      {
        metric: "go_gc_heap_allocs_bytes",
        description: "Cumulative sum of memory allocated to the heap by the application.",
        type: "counter",
        unit: "",
        help: "Sourced from /gc/heap/allocs:bytes."
      },
      {
        metric: "go_gc_heap_allocs_bytes_total",
        description: "Cumulative sum of memory allocated to the heap by the application.",
        type: "counter",
        unit: "",
        help: "Sourced from /gc/heap/allocs:bytes."
      },
      {
        metric: "go_gc_heap_allocs_objects",
        description: "Cumulative count of heap allocations triggered by the application.",
        type: "counter",
        unit: "",
        help: "Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks. Sourced from /gc/heap/allocs:objects."
      },
      {
        metric: "go_gc_heap_allocs_objects_total",
        description: "Cumulative count of heap allocations triggered by the application.",
        type: "counter",
        unit: "",
        help: "Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks. Sourced from /gc/heap/allocs:objects."
      },
      {
        metric: "go_gc_heap_frees_by_size_bytes",
        description: "Distribution of freed heap allocations by approximate size.",
        type: "histogram",
        unit: "",
        help: "Bucket counts increase monotonically. Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks. Sourced from /gc/heap/frees-by-size:bytes."
      },
      {
        metric: "go_gc_heap_frees_bytes",
        description: "Cumulative sum of heap memory freed by the garbage collector.",
        type: "counter",
        unit: "",
        help: "Sourced from /gc/heap/frees:bytes."
      },
      {
        metric: "go_gc_heap_frees_bytes_total",
        description: "Cumulative sum of heap memory freed by the garbage collector.",
        type: "counter",
        unit: "",
        help: "Sourced from /gc/heap/frees:bytes."
      },
      {
        metric: "go_gc_heap_frees_objects",
        description: "Cumulative count of heap allocations whose storage was freed by the garbage collector.",
        type: "counter",
        unit: "",
        help: "Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks. Sourced from /gc/heap/frees:objects."
      },
      {
        metric: "go_gc_heap_frees_objects_total",
        description: "Cumulative count of heap allocations whose storage was freed by the garbage collector.",
        type: "counter",
        unit: "",
        help: "Note that this does not include tiny objects as defined by /gc/heap/tiny/allocs:objects, only tiny blocks. Sourced from /gc/heap/frees:objects."
      },
      {
        metric: "go_gc_heap_goal_bytes",
        description: "Heap size target for the end of the GC cycle.",
        type: "gauge",
        unit: "",
        help: "Sourced from /gc/heap/goal:bytes."
      },
      {
        metric: "go_gc_heap_live_bytes",
        description: "Heap memory occupied by live objects that were marked by the previous GC.",
        type: "gauge",
        unit: "",
        help: "Sourced from /gc/heap/live:bytes."
      },
      {
        metric: "go_gc_heap_objects_objects",
        description: "Number of objects, live or unswept, occupying heap memory.",
        type: "gauge",
        unit: "",
        help: "Sourced from /gc/heap/objects:objects."
      },
      {
        metric: "go_gc_heap_tiny_allocs_objects",
        description: "Count of small allocations that are packed together into blocks.",
        type: "counter",
        unit: "",
        help: "These allocations are counted separately from other allocations because each individual allocation is not tracked by the runtime, only their block. Each block is already accounted for in allocs-by-size and frees-by-size. Sourced from /gc/heap/tiny/allocs:objects."
      },
      {
        metric: "go_gc_heap_tiny_allocs_objects_total",
        description: "Count of small allocations that are packed together into blocks.",
        type: "counter",
        unit: "",
        help: "These allocations are counted separately from other allocations because each individual allocation is not tracked by the runtime, only their block. Each block is already accounted for in allocs-by-size and frees-by-size. Sourced from /gc/heap/tiny/allocs:objects."
      },
      {
        metric: "go_gc_limiter_last_enabled_gc_cycle",
        description: "GC cycle the last time the GC CPU limiter was enabled.",
        type: "gauge",
        unit: "",
        help: "This metric is useful for diagnosing the root cause of an out-of-memory error, because the limiter trades memory for CPU time when the GC's CPU time gets too high. This is most likely to occur with use of SetMemoryLimit. The first GC cycle is cycle 1, so a value of 0 indicates that it was never enabled. Sourced from /gc/limiter/last-enabled:gc-cycle."
      },
      {
        metric: "go_gc_pauses_seconds",
        description: "Deprecated. Prefer the identical /sched/pauses/total/gc:seconds.",
        type: "histogram",
        unit: "",
        help: "Sourced from /gc/pauses:seconds."
      },
      {
        metric: "go_gc_scan_globals_bytes",
        description: "The total amount of global variable space that is scannable.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /gc/scan/globals:bytes"
      },
      {
        metric: "go_gc_scan_heap_bytes",
        description: "The total amount of heap space that is scannable.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /gc/scan/heap:bytes"
      },
      {
        metric: "go_gc_scan_stack_bytes",
        description: "The number of bytes of stack that were scanned during the last GC cycle.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /gc/scan/stack:bytes"
      },
      {
        metric: "go_gc_scan_total_bytes",
        description: "The total amount of scannable space, including heap, stack, and globals.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /gc/scan/total:bytes"
      },
      {
        metric: "go_gc_stack_starting_size_bytes",
        description: "The initial stack size allocated for new goroutines.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /gc/stack/starting-size:bytes"
      },
      {
        metric: "go_godebug_non_default_behavior_asynctimerchan_events",
        description: "The count of non-default behaviors triggered by the time package due to GODEBUG=asynctimerchan setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/asynctimerchan:events"
      },
      {
        metric: "go_godebug_non_default_behavior_execerrdot_events",
        description: "The count of non-default behaviors triggered by the os/exec package due to GODEBUG=execerrdot setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/execerrdot:events"
      },
      {
        metric: "go_godebug_non_default_behavior_gocachehash_events",
        description: "The count of non-default behaviors triggered by the cmd/go package due to GODEBUG=gocachehash setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/gocachehash:events"
      },
      {
        metric: "go_godebug_non_default_behavior_gocachetest_events",
        description: "The count of non-default behaviors triggered by the cmd/go package due to GODEBUG=gocachetest setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/gocachetest:events"
      },
      {
        metric: "go_godebug_non_default_behavior_gocacheverify_events",
        description: "The count of non-default behaviors triggered by the cmd/go package due to GODEBUG=gocacheverify setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/gocacheverify:events"
      },
      {
        metric: "go_godebug_non_default_behavior_gotypesalias_events",
        description: "The count of non-default behaviors triggered by the go/types package due to GODEBUG=gotypesalias setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/gotypesalias:events"
      },
      {
        metric: "go_godebug_non_default_behavior_http2client_events",
        description: "The count of non-default behaviors triggered by the net/http package due to GODEBUG=http2client setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/http2client:events"
      },
      {
        metric: "go_godebug_non_default_behavior_http2server_events",
        description: "The count of non-default behaviors triggered by the net/http package due to GODEBUG=http2server setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/http2server:events"
      },
      {
        metric: "go_godebug_non_default_behavior_httplaxcontentlength_events",
        description: "The count of non-default behaviors triggered by the net/http package due to GODEBUG=httplaxcontentlength setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/httplaxcontentlength:events"
      },
      {
        metric: "go_godebug_non_default_behavior_httpmuxgo121_events",
        description: "The count of non-default behaviors triggered by the net/http package due to GODEBUG=httpmuxgo121 setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/httpmuxgo121:events"
      },
      {
        metric: "go_godebug_non_default_behavior_httpservecontentkeepheaders_events",
        description: "The count of non-default behaviors triggered by the net/http package due to GODEBUG=httpservecontentkeepheaders setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/httpservecontentkeepheaders:events"
      },
      {
        metric: "go_godebug_non_default_behavior_installgoroot_events",
        description: "The count of non-default behaviors triggered by the go/build package due to GODEBUG=installgoroot setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/installgoroot:events"
      },
      {
        metric: "go_godebug_non_default_behavior_multipartmaxheaders_events",
        description: "The count of non-default behaviors triggered by the mime/multipart package due to GODEBUG=multipartmaxheaders setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/multipartmaxheaders:events"
      },
      {
        metric: "go_godebug_non_default_behavior_multipartmaxparts_events",
        description: "The count of non-default behaviors triggered by the mime/multipart package due to GODEBUG=multipartmaxparts setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/multipartmaxparts:events"
      },
      {
        metric: "go_godebug_non_default_behavior_multipathtcp_events",
        description: "The count of non-default behaviors triggered by the net package due to GODEBUG=multipathtcp setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/multipathtcp:events"
      },
      {
        metric: "go_godebug_non_default_behavior_netedns0_events",
        description: "The count of non-default behaviors triggered by the net package due to GODEBUG=netedns0 setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/netedns0:events"
      },
      {
        metric: "go_godebug_non_default_behavior_panicnil_events",
        description: "The count of non-default behaviors triggered by the runtime package due to GODEBUG=panicnil setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/panicnil:events"
      },
      {
        metric: "go_godebug_non_default_behavior_randautoseed_events",
        description: "The count of non-default behaviors triggered by the math/rand package due to GODEBUG=randautoseed setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/randautoseed:events"
      },
      {
        metric: "go_godebug_non_default_behavior_tarinsecurepath_events",
        description: "The count of non-default behaviors triggered by the archive/tar package due to GODEBUG=tarinsecurepath setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/tarinsecurepath:events"
      },
      {
        metric: "go_godebug_non_default_behavior_tls10server_events",
        description: "The count of non-default behaviors triggered by the crypto/tls package due to GODEBUG=tls10server setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/tls10server:events"
      },
      {
        metric: "go_godebug_non_default_behavior_tls3des_events",
        description: "The count of non-default behaviors triggered by the crypto/tls package due to GODEBUG=tls3des setting.",
        type: "counter",
        unit: "events",
        help: "Sourced from /godebug/non-default-behavior/tls3des:events"
      },
      {
        metric: "go_godebug_non_default_behavior_tlsmaxrsasize_events",
        description: "The number of non-default behaviors executed by the crypto/tls package due to a non-default GODEBUG=tlsmaxrsasize setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/tlsmaxrsasize:events"
      },
      {
        metric: "go_godebug_non_default_behavior_tlsrsakex_events",
        description: "The number of non-default behaviors executed by the crypto/tls package due to a non-default GODEBUG=tlsrsakex setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/tlsrsakex:events"
      },
      {
        metric: "go_godebug_non_default_behavior_tlsunsafeekm_events",
        description: "The number of non-default behaviors executed by the crypto/tls package due to a non-default GODEBUG=tlsunsafeekm setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/tlsunsafeekm:events"
      },
      {
        metric: "go_godebug_non_default_behavior_winreadlinkvolume_events",
        description: "The number of non-default behaviors executed by the os package due to a non-default GODEBUG=winreadlinkvolume setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/winreadlinkvolume:events"
      },
      {
        metric: "go_godebug_non_default_behavior_winsymlink_events",
        description: "The number of non-default behaviors executed by the os package due to a non-default GODEBUG=winsymlink setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/winsymlink:events"
      },
      {
        metric: "go_godebug_non_default_behavior_x509keypairleaf_events",
        description: "The number of non-default behaviors executed by the crypto/tls package due to a non-default GODEBUG=x509keypairleaf setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/x509keypairleaf:events"
      },
      {
        metric: "go_godebug_non_default_behavior_x509negativeserial_events",
        description: "The number of non-default behaviors executed by the crypto/x509 package due to a non-default GODEBUG=x509negativeserial setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/x509negativeserial:events"
      },
      {
        metric: "go_godebug_non_default_behavior_x509sha1_events",
        description: "The number of non-default behaviors executed by the crypto/x509 package due to a non-default GODEBUG=x509sha1 setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/x509sha1:events"
      },
      {
        metric: "go_godebug_non_default_behavior_x509usefallbackroots_events",
        description: "The number of non-default behaviors executed by the crypto/x509 package due to a non-default GODEBUG=x509usefallbackroots setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/x509usefallbackroots:events"
      },
      {
        metric: "go_godebug_non_default_behavior_x509usepolicies_events",
        description: "The number of non-default behaviors executed by the crypto/x509 package due to a non-default GODEBUG=x509usepolicies setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/x509usepolicies:events"
      },
      {
        metric: "go_godebug_non_default_behavior_zipinsecurepath_events",
        description: "The number of non-default behaviors executed by the archive/zip package due to a non-default GODEBUG=zipinsecurepath setting.",
        type: "counter",
        unit: "",
        help: "Sourced from /godebug/non-default-behavior/zipinsecurepath:events"
      },
      {
        metric: "go_goroutines",
        description: "Number of goroutines that currently exist.",
        type: "gauge",
        unit: "",
        help: "Tracks the count of existing goroutines."
      },
      {
        metric: "go_info",
        description: "Information about the Go environment.",
        type: "gauge",
        unit: "",
        help: "Provides metadata about the Go runtime environment."
      },
      {
        metric: "go_memory_classes_heap_free_bytes",
        description: "Memory that is completely free and eligible to be returned to the system but hasn't been yet.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/heap/free:bytes"
      },
      {
        metric: "go_memory_classes_heap_objects_bytes",
        description: "Memory occupied by live and unmarked heap objects.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/heap/objects:bytes"
      },
      {
        metric: "go_memory_classes_heap_released_bytes",
        description: "Memory freed and returned to the system.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/heap/released:bytes"
      },
      {
        metric: "go_memory_classes_heap_stacks_bytes",
        description: "Memory allocated from the heap for stack space.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/heap/stacks:bytes"
      },
      {
        metric: "go_memory_classes_heap_unused_bytes",
        description: "Heap memory reserved but not currently used for objects.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/heap/unused:bytes"
      },
      {
        metric: "go_memory_classes_metadata_mcache_free_bytes",
        description: "Memory reserved for runtime mcache structures, currently unused.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/metadata/mcache/free:bytes"
      },
      {
        metric: "go_memory_classes_metadata_mcache_inuse_bytes",
        description: "Memory used by runtime mcache structures.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/metadata/mcache/inuse:bytes"
      },
      {
        metric: "go_memory_classes_metadata_mspan_free_bytes",
        description: "Memory reserved for runtime mspan structures, currently unused.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/metadata/mspan/free:bytes"
      },
      {
        metric: "go_memory_classes_metadata_mspan_inuse_bytes",
        description: "Memory occupied by runtime mspan structures currently in use.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/metadata/mspan/inuse:bytes."
      },
      {
        metric: "go_memory_classes_metadata_other_bytes",
        description: "Memory reserved for or used to hold runtime metadata.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/metadata/other:bytes."
      },
      {
        metric: "go_memory_classes_os_stacks_bytes",
        description: "Stack memory allocated by the operating system.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/os-stacks:bytes."
      },
      {
        metric: "go_memory_classes_other_bytes",
        description: "Memory used by various runtime structures.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/other:bytes."
      },
      {
        metric: "go_memory_classes_profiling_buckets_bytes",
        description: "Memory used by the stack trace hash map for profiling.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/profiling/buckets:bytes."
      },
      {
        metric: "go_memory_classes_total_bytes",
        description: "Total memory mapped by the Go runtime as read-write.",
        type: "gauge",
        unit: "bytes",
        help: "Sourced from /memory/classes/total:bytes."
      },
      {
        metric: "go_memstats_alloc_bytes",
        description: "Number of bytes allocated and still in use.",
        type: "gauge",
        unit: "bytes",
        help: "Equals to /memory/classes/heap/objects:bytes."
      },
      {
        metric: "go_memstats_alloc_bytes_total",
        description: "Total number of bytes allocated, even if freed.",
        type: "counter",
        unit: "bytes",
        help: "Equals to /gc/heap/allocs:bytes."
      },
      {
        metric: "go_memstats_buck_hash_sys_bytes",
        description: "Bytes used by the profiling bucket hash table.",
        type: "gauge",
        unit: "bytes",
        help: "Equals to /memory/classes/profiling/buckets:bytes."
      },
      {
        metric: "go_memstats_frees",
        description: "Total number of heap objects freed.",
        type: "counter",
        unit: "objects",
        help: "Equals to /gc/heap/frees:objects + /gc/heap/tiny/allocs:objects."
      },
      {
        metric: "go_memstats_frees_total",
        description: "Total number of frees.",
        type: "counter",
        unit: "objects",
        help: "Equals to /gc/heap/frees:objects + /gc/heap/tiny/allocs:objects."
      },
      {
        metric: "go_memstats_gc_sys_bytes",
        description: "Bytes used for garbage collection system metadata.",
        type: "gauge",
        unit: "bytes",
        help: "Equals to /memory/classes/metadata/other:bytes."
      },
      {
        metric: "go_memstats_heap_alloc_bytes",
        description: "Heap bytes allocated and currently in use.",
        type: "gauge",
        unit: "bytes",
        help: "Equals to /memory/classes/heap/objects:bytes."
      },
      {
        metric: "go_memstats_heap_idle_bytes",
        description: "Heap bytes waiting to be used.",
        type: "gauge",
        unit: "bytes",
        help: "Equals to /memory/classes/heap/released:bytes + /memory/classes/heap/free:bytes."
      },
      {
        metric: "go_memstats_heap_inuse_bytes",
        description: "Heap bytes currently in use.",
        type: "gauge",
        unit: "bytes",
        help: "Equals to /memory/classes/heap/objects:bytes + /memory/classes/heap/unused:bytes."
      },
      {
        metric: "go_memstats_heap_objects",
        description: "Number of allocated objects in the heap.",
        type: "gauge",
        unit: "",
        help: "Number of allocated objects."
      },
      {
        metric: "go_memstats_heap_released_bytes",
        description: "Heap memory released back to the operating system.",
        type: "gauge",
        unit: "",
        help: "Number of heap bytes released to OS."
      },
      {
        metric: "go_memstats_heap_sys_bytes",
        description: "Total bytes of heap memory obtained from the system.",
        type: "gauge",
        unit: "",
        help: "Number of heap bytes obtained from system."
      },
      {
        metric: "go_memstats_last_gc_time_seconds",
        description: "Time of the last garbage collection in seconds since 1970.",
        type: "gauge",
        unit: "seconds",
        help: "Number of seconds since 1970 of last garbage collection."
      },
      {
        metric: "go_memstats_lookups_total",
        description: "Total number of pointer lookups performed.",
        type: "counter",
        unit: "",
        help: "Total number of pointer lookups."
      },
      {
        metric: "go_memstats_mallocs",
        description: "Total heap objects allocated, including both live and garbage collected.",
        type: "counter",
        unit: "",
        help: "Total number of heap objects allocated."
      },
      {
        metric: "go_memstats_mallocs_total",
        description: "Cumulative total of all heap object allocations.",
        type: "counter",
        unit: "",
        help: "Total number of mallocs."
      },
      {
        metric: "go_memstats_mcache_inuse_bytes",
        description: "Bytes in use by mcache structures.",
        type: "gauge",
        unit: "bytes",
        help: "Number of bytes in use by mcache structures."
      },
      {
        metric: "go_memstats_mcache_sys_bytes",
        description: "Bytes used by mcache structures obtained from the system.",
        type: "gauge",
        unit: "bytes",
        help: "Number of bytes used for mcache structures obtained from system."
      },
      {
        metric: "go_memstats_mspan_inuse_bytes",
        description: "Bytes in use by mspan structures.",
        type: "gauge",
        unit: "bytes",
        help: "Number of bytes in use by mspan structures."
      },
      {
        metric: "go_memstats_mspan_sys_bytes",
        description: "Bytes used by mspan structures obtained from the system.",
        type: "gauge",
        unit: "bytes",
        help: "Number of bytes used for mspan structures obtained from system."
      },
      {
        metric: "go_memstats_next_gc_bytes",
        description: "Heap size threshold for the next garbage collection.",
        type: "gauge",
        unit: "bytes",
        help: "Number of heap bytes when next garbage collection will take place."
      },
      {
        metric: "go_memstats_other_sys_bytes",
        description: "Bytes used for miscellaneous system allocations.",
        type: "gauge",
        unit: "bytes",
        help: "Number of bytes used for other system allocations."
      },
      {
        metric: "go_memstats_stack_inuse_bytes",
        description: "Bytes actively used by the stack allocator.",
        type: "gauge",
        unit: "bytes",
        help: "Number of bytes in use by the stack allocator."
      },
      {
        metric: "go_memstats_stack_sys_bytes",
        description: "Bytes obtained from the system for the stack allocator.",
        type: "gauge",
        unit: "bytes",
        help: "Number of bytes obtained from system for stack allocator."
      },
      {
        metric: "go_memstats_sys_bytes",
        description: "Total bytes obtained from the system.",
        type: "gauge",
        unit: "bytes",
        help: "Number of bytes obtained from system."
      },
      {
        metric: "go_sched_gomaxprocs_threads",
        description: "Current GOMAXPROCS setting or number of OS threads that can execute Go code.",
        type: "gauge",
        unit: "threads",
        help: "The current runtime.GOMAXPROCS setting."
      },
      {
        metric: "go_sched_goroutines_goroutines",
        description: "Number of live goroutines.",
        type: "gauge",
        unit: "goroutines",
        help: "Count of live goroutines."
      },
      {
        metric: "go_sched_latencies_seconds",
        description: "Time spent by goroutines in the scheduler before running.",
        type: "histogram",
        unit: "seconds",
        help: "Distribution of the time goroutines have spent in the scheduler."
      },
      {
        metric: "go_sched_pauses_stopping_gc_seconds",
        description: "GC-related stop-the-world latencies during stopping phase.",
        type: "histogram",
        unit: "seconds",
        help: "Distribution of individual GC-related stop-the-world stopping latencies."
      },
      {
        metric: "go_sched_pauses_stopping_other_seconds",
        description: "Non-GC-related stop-the-world latencies during stopping phase.",
        type: "histogram",
        unit: "seconds",
        help: "Distribution of individual non-GC-related stop-the-world stopping latencies."
      },
      {
        metric: "go_sched_pauses_total_gc_seconds",
        description: "Total GC-related stop-the-world pause latencies.",
        type: "histogram",
        unit: "seconds",
        help: "Distribution of individual GC-related stop-the-world pause latencies."
      },
      {
        metric: "go_sched_pauses_total_other_seconds",
        description: "Total non-GC-related stop-the-world pause latencies.",
        type: "histogram",
        unit: "seconds",
        help: "Distribution of individual non-GC-related stop-the-world pause latencies."
      },
      {
        metric: "go_sql_stats_connections_blocked_seconds",
        description: "The total time blocked waiting for a new connection.",
        type: "unknown",
        unit: "",
        help: "The total time blocked waiting for a new connection."
      },
      {
        metric: "go_sql_stats_connections_closed_max_idle",
        description: "The total number of connections closed due to SetMaxIdleConns.",
        type: "unknown",
        unit: "",
        help: "The total number of connections closed due to SetMaxIdleConns."
      },
      {
        metric: "go_sql_stats_connections_closed_max_idle_time",
        description: "The total number of connections closed due to SetConnMaxIdleTime.",
        type: "unknown",
        unit: "",
        help: "The total number of connections closed due to SetConnMaxIdleTime."
      },
      {
        metric: "go_sql_stats_connections_closed_max_lifetime",
        description: "The total number of connections closed due to SetConnMaxLifetime.",
        type: "unknown",
        unit: "",
        help: "The total number of connections closed due to SetConnMaxLifetime."
      },
      {
        metric: "go_sql_stats_connections_idle",
        description: "The number of idle connections.",
        type: "gauge",
        unit: "",
        help: "The number of idle connections."
      },
      {
        metric: "go_sql_stats_connections_in_use",
        description: "The number of connections currently in use.",
        type: "gauge",
        unit: "",
        help: "The number of connections currently in use."
      },
      {
        metric: "go_sql_stats_connections_max_open",
        description: "Maximum number of open connections to the database.",
        type: "gauge",
        unit: "",
        help: "Maximum number of open connections to the database."
      },
      {
        metric: "go_sql_stats_connections_open",
        description: "The number of established connections both in use and idle.",
        type: "gauge",
        unit: "",
        help: "The number of established connections both in use and idle."
      },
      {
        metric: "go_sql_stats_connections_waited_for",
        description: "The total number of connections waited for.",
        type: "unknown",
        unit: "",
        help: "The total number of connections waited for."
      },
      {
        metric: "go_sync_mutex_wait_total_seconds",
        description: "Approximate cumulative time goroutines have spent blocked on a sync.Mutex, sync.RWMutex, or runtime-internal lock.",
        type: "counter",
        unit: "",
        help: "Approximate cumulative time goroutines have spent blocked on a sync.Mutex, sync.RWMutex, or runtime-internal lock."
      },
      {
        metric: "go_threads",
        description: "Number of OS threads created.",
        type: "gauge",
        unit: "",
        help: "Number of OS threads created."
      },
      {
        metric: "grafana_access_evaluation_count",
        description: "Number of evaluation calls.",
        type: "unknown",
        unit: "",
        help: "Number of evaluation calls."
      },
      {
        metric: "grafana_access_evaluation_duration",
        description: "Histogram for the runtime of evaluation function.",
        type: "histogram",
        unit: "",
        help: "Histogram for the runtime of evaluation function."
      },
      {
        metric: "grafana_api_dataproxy_request_all_milliseconds",
        description: "Tracks the duration of all Grafana API dataproxy requests.",
        type: "summary",
        unit: "",
        help: "summary for dataproxy request duration"
      },
      {
        metric: "grafana_api_login_oauth",
        description: "Counts the number of OAuth login attempts via the Grafana API.",
        type: "counter",
        unit: "",
        help: "api login oauth counter"
      },
      {
        metric: "grafana_api_login_post",
        description: "Counts the number of POST login attempts via the Grafana API.",
        type: "counter",
        unit: "",
        help: "api login post counter"
      },
      {
        metric: "grafana_api_login_saml",
        description: "Counts the number of SAML login attempts via the Grafana API.",
        type: "counter",
        unit: "",
        help: "api login saml counter"
      },
      {
        metric: "grafana_api_models_dashboard_insert",
        description: "Tracks the number of dashboards inserted via the Grafana API.",
        type: "counter",
        unit: "",
        help: "dashboards inserted"
      },
      {
        metric: "grafana_api_org_create",
        description: "Counts the number of organizations created via the Grafana API.",
        type: "counter",
        unit: "",
        help: "api org created counter"
      },
      {
        metric: "grafana_api_response_status",
        description: "Tracks the HTTP response status codes for the Grafana API.",
        type: "counter",
        unit: "",
        help: "api http response status"
      },
      {
        metric: "grafana_api_user_signup_completed",
        description: "Counts the number of users who have completed the signup process.",
        type: "counter",
        unit: "",
        help: "amount of users who completed the signup flow"
      },
      {
        metric: "grafana_api_user_signup_invite",
        description: "Counts the number of users invited to sign up.",
        type: "counter",
        unit: "",
        help: "amount of users who have been invited"
      },
      {
        metric: "grafana_api_user_signup_started",
        description: "Counts the number of users who started the signup process.",
        type: "counter",
        unit: "",
        help: "amount of users who started the signup flow"
      },
      {
        metric: "grafana_apiserver_audit_event",
        description: "Counts the audit events generated and sent to the backend.",
        type: "counter",
        unit: "",
        help: "[ALPHA] Counter of audit events generated and sent to the audit backend."
      },
      {
        metric: "grafana_apiserver_audit_requests_rejected",
        description: "Counts the requests rejected due to audit logging backend errors.",
        type: "counter",
        unit: "",
        help: "[ALPHA] Counter of apiserver requests rejected due to an error in audit logging backend."
      },
      {
        metric: "grafana_apiserver_client_certificate_expiration_seconds",
        description: "Tracks the distribution of remaining lifetimes on client certificates.",
        type: "histogram",
        unit: "",
        help: "[ALPHA] Distribution of the remaining lifetime on the certificate used to authenticate a request."
      },
      {
        metric: "grafana_apiserver_current_inflight_requests",
        description: "Measures the number of inflight requests to the apiserver.",
        type: "gauge",
        unit: "",
        help: "[STABLE] Maximal number of currently used inflight request limit of this apiserver per request kind in last second."
      },
      {
        metric: "grafana_apiserver_envelope_encryption_dek_cache_fill_percent",
        description: "Tracks the percentage of cache slots filled by DEKs.",
        type: "gauge",
        unit: "",
        help: "[ALPHA] Percent of the cache slots currently occupied by cached DEKs."
      },
      {
        metric: "grafana_apiserver_flowcontrol_read_vs_write_current_requests",
        description: "Observes the fraction of read vs write requests in execution stages.",
        type: "histogram",
        unit: "",
        help: "EXPERIMENTAL: [ALPHA] Observations, at the end of every nanosecond, of the number of requests (as a fraction of the relevant limit) waiting or in regular stage of execution"
      },
      {
        metric: "grafana_apiserver_request",
        description: "Tracks the number of requests to the apiserver categorized by multiple dimensions.",
        type: "counter",
        unit: "",
        help: "[STABLE] Counter of apiserver requests broken out for each verb, dry run value, group, version, resource, scope, component, and HTTP response code."
      },
      {
        metric: "grafana_apiserver_request_aborts",
        description: "Counts the number of requests aborted by the apiserver.",
        type: "counter",
        unit: "",
        help: "[ALPHA] Number of requests which apiserver aborted possibly due to a timeout, for each group, version, verb, resource, subresource and scope"
      },
      {
        metric: "grafana_apiserver_webhooks_x509_insecure_sha1",
        description: "Counts requests or connection failures due to insecure SHA1 certificates.",
        type: "counter",
        unit: "",
        help: "[ALPHA] Counts the number of requests to servers with insecure SHA1 signatures in their serving certificate OR the number of connection failures due to the insecure SHA1 signatures (either/or, based on the runtime environment)."
      },
      {
        metric: "grafana_apiserver_webhooks_x509_missing_san",
        description: "Tracks requests or connection failures caused by missing SAN extensions in certificates.",
        type: "counter",
        unit: "",
        help: "[ALPHA] Counts the number of requests to servers missing SAN extension in their serving certificate OR the number of connection failures due to the lack of x509 certificate SAN extension missing (either/or, based on the runtime environment)."
      },
      {
        metric: "grafana_authenticated_user_requests",
        description: "Counter of requests authenticated by username.",
        type: "unknown",
        unit: "",
        help: "[ALPHA] Counter of authenticated requests broken out by username."
      },
      {
        metric: "grafana_authentication_attempts",
        description: "Counts the total number of authentication attempts.",
        type: "unknown",
        unit: "",
        help: "[ALPHA] Counter of authenticated attempts."
      },
      {
        metric: "grafana_authentication_duration_seconds",
        description: "Tracks how long authentication takes, in seconds.",
        type: "histogram",
        unit: "seconds",
        help: "[ALPHA] Authentication duration in seconds broken out by result."
      },
      {
        metric: "grafana_authn_authn_failed_authentication",
        description: "Counts failed authentication attempts.",
        type: "counter",
        unit: "",
        help: "Number of failed authentications."
      },
      {
        metric: "grafana_authn_authn_failed_login",
        description: "Tracks the number of failed login attempts.",
        type: "counter",
        unit: "",
        help: "Number of failed logins."
      },
      {
        metric: "grafana_authn_authn_successful_authentication",
        description: "Counts successful authentications.",
        type: "counter",
        unit: "",
        help: "Number of successful authentications."
      },
      {
        metric: "grafana_authorization_attempts",
        description: "Counts attempts to authorize, categorized by result.",
        type: "counter",
        unit: "",
        help: "[ALPHA] Counter of authorization attempts broken down by result. It can be either 'allowed', 'denied', 'no-opinion' or 'error'."
      },
      {
        metric: "grafana_authorization_duration_seconds",
        description: "Measures the time taken for authorization, in seconds.",
        type: "histogram",
        unit: "seconds",
        help: "[ALPHA] Authorization duration in seconds broken out by result."
      },
      {
        metric: "grafana_build_info",
        description: "Provides build details such as version, revision, and branch.",
        type: "gauge",
        unit: "",
        help: "A metric with a constant '1' value labeled by version, revision, branch, and goversion from which Grafana was built."
      },
      {
        metric: "grafana_build_timestamp",
        description: "Indicates the epoch time when the binary was built.",
        type: "gauge",
        unit: "",
        help: "A metric exposing when the binary was built in epoch."
      },
      {
        metric: "grafana_cardinality_enforcement_unexpected_categorizations",
        description: "Counts unexpected categorizations during cardinality enforcement.",
        type: "counter",
        unit: "",
        help: "[ALPHA] The count of unexpected categorizations during cardinality enforcement."
      },
      {
        metric: "grafana_database_conn_idle",
        description: "Tracks the number of idle database connections.",
        type: "gauge",
        unit: "",
        help: "The number of idle connections."
      },
      {
        metric: "grafana_database_conn_in_use",
        description: "Tracks the number of database connections currently in use.",
        type: "gauge",
        unit: "",
        help: "The number of connections currently in use."
      },
      {
        metric: "grafana_database_conn_max_idle_closed",
        description: "Counts connections closed due to max idle limit.",
        type: "counter",
        unit: "",
        help: "The total number of connections closed due to SetMaxIdleConns."
      },
      {
        metric: "grafana_database_conn_max_idle_closed_seconds",
        description: "Tracks the duration of connections closed due to max idle time.",
        type: "unknown",
        unit: "",
        help: "The total number of connections closed due to SetConnMaxIdleTime."
      },
      {
        metric: "grafana_database_conn_max_lifetime_closed",
        description: "Counts connections closed due to exceeding max lifetime.",
        type: "counter",
        unit: "",
        help: "The total number of connections closed due to SetConnMaxLifetime."
      },
      {
        metric: "grafana_database_conn_max_open",
        description: "Indicates the maximum number of open database connections.",
        type: "gauge",
        unit: "",
        help: "Maximum number of open connections to the database."
      },
      {
        metric: "grafana_database_conn_open",
        description: "Shows the total number of open database connections, both in use and idle.",
        type: "gauge",
        unit: "",
        help: "The number of established connections both in use and idle."
      },
      {
        metric: "grafana_database_conn_wait_count",
        description: "Counts the number of times a connection had to wait.",
        type: "counter",
        unit: "",
        help: "The total number of connections waited for."
      },
      {
        metric: "grafana_database_conn_wait_duration_seconds",
        description: "Measures the total wait time for new database connections, in seconds.",
        type: "unknown",
        unit: "",
        help: "The total time blocked waiting for a new connection."
      },
      {
        metric: "grafana_datasource_request",
        description: "Counts the outgoing data source requests.",
        type: "counter",
        unit: "",
        help: "A counter for outgoing requests for a data source."
      },
      {
        metric: "grafana_datasource_request_duration_seconds",
        description: "Measures the duration of outgoing data source requests, in seconds.",
        type: "histogram",
        unit: "seconds",
        help: "Histogram of durations of outgoing data source requests sent from Grafana."
      },
      {
        metric: "grafana_live_node_action_count",
        description: "Tracks the number of various actions executed within the Grafana Live Node.",
        type: "unknown",
        unit: "",
        help: "Number of various actions called."
      },
      {
        metric: "grafana_live_node_broadcast_duration_seconds",
        description: "Measures the time taken for broadcasting in seconds.",
        type: "histogram",
        unit: "",
        help: "Broadcast duration in seconds"
      },
      {
        metric: "grafana_live_node_build",
        description: "Provides build information for the Grafana Live Node.",
        type: "gauge",
        unit: "",
        help: "Node build info."
      },
      {
        metric: "grafana_live_node_messages_received_count",
        description: "Counts the number of messages received by the node from the broker.",
        type: "unknown",
        unit: "",
        help: "Number of messages received from broker."
      },
      {
        metric: "grafana_live_node_messages_sent_count",
        description: "Counts the number of messages sent by the node to the broker.",
        type: "unknown",
        unit: "",
        help: "Number of messages sent by node to broker."
      },
      {
        metric: "grafana_live_node_num_channels",
        description: "Tracks the number of active channels with one or more subscribers.",
        type: "gauge",
        unit: "",
        help: "Number of channels with one or more subscribers."
      },
      {
        metric: "grafana_live_node_num_clients",
        description: "Counts the number of clients currently connected to the node.",
        type: "gauge",
        unit: "",
        help: "Number of clients connected."
      },
      {
        metric: "grafana_live_node_num_nodes",
        description: "Tracks the total number of nodes in the cluster.",
        type: "gauge",
        unit: "",
        help: "Number of nodes in the cluster."
      },
      {
        metric: "grafana_live_node_num_subscriptions",
        description: "Counts the number of active subscriptions in the Grafana Live Node.",
        type: "gauge",
        unit: "",
        help: "Number of subscriptions."
      },
      {
        metric: "grafana_live_node_num_users",
        description: "Tracks the number of unique users connected to the Grafana Live Node.",
        type: "gauge",
        unit: "",
        help: "Number of unique users connected."
      },
      {
        metric: "grafana_live_node_pub_sub_lag_seconds",
        description: "Measures the lag time in Pub/Sub operations in seconds.",
        type: "histogram",
        unit: "",
        help: "Pub sub lag in seconds"
      },
      {
        metric: "grafana_live_transport_connect_count",
        description: "Tracks the number of transport connections established.",
        type: "unknown",
        unit: "",
        help: "Number of connections to specific transport."
      },
      {
        metric: "grafana_live_transport_messages_received",
        description: "Counts the messages received from client connections over a specific transport.",
        type: "unknown",
        unit: "",
        help: "Number of messages received from client connections over specific transport."
      },
      {
        metric: "grafana_live_transport_messages_received_size",
        description: "Tracks the size in bytes of messages received from clients over specific transport.",
        type: "unknown",
        unit: "",
        help: "Size in bytes of messages received from client connections over specific transport."
      },
      {
        metric: "grafana_live_transport_messages_sent",
        description: "Counts the messages sent to client connections over a specific transport.",
        type: "unknown",
        unit: "",
        help: "Number of messages sent to client connections over specific transport."
      },
      {
        metric: "grafana_live_transport_messages_sent_size",
        description: "Tracks the size in bytes of messages sent to client connections over specific transport.",
        type: "unknown",
        unit: "",
        help: "Size in bytes of messages sent to client connections over specific transport."
      },
      {
        metric: "grafana_page_response_status",
        description: "Monitors HTTP response statuses for Grafana pages.",
        type: "counter",
        unit: "",
        help: "page http response status"
      },
      {
        metric: "grafana_plugin_build_info",
        description: "Provides build information for Grafana plugins, labeled by pluginId, pluginType, and version.",
        type: "gauge",
        unit: "",
        help: "A metric with a constant '1' value labeled by pluginId, pluginType and version from which Grafana plugin was built"
      },
      {
        metric: "grafana_plugin_request",
        description: "Tracks the total number of plugin requests made to Grafana.",
        type: "counter",
        unit: "",
        help: "The total amount of plugin requests"
      },
      {
        metric: "grafana_plugin_request_duration_milliseconds",
        description: "Measures the duration of plugin requests in milliseconds.",
        type: "histogram",
        unit: "",
        help: "Plugin request duration"
      },
      {
        metric: "grafana_plugin_request_duration_seconds",
        description: "Measures the duration of plugin requests in seconds.",
        type: "histogram",
        unit: "",
        help: "Plugin request duration in seconds"
      },
      {
        metric: "grafana_plugin_request_size_bytes",
        description: "Tracks the size of plugin requests in bytes.",
        type: "histogram",
        unit: "",
        help: "histogram of plugin request sizes returned"
      },
      {
        metric: "grafana_process_cpu_seconds",
        description: "Monitors the total CPU time used by Grafana process in seconds.",
        type: "counter",
        unit: "",
        help: "Total user and system CPU time spent in seconds."
      },
      {
        metric: "grafana_process_max_fds",
        description: "Shows the maximum number of file descriptors the process can open.",
        type: "gauge",
        unit: "",
        help: "Maximum number of open file descriptors."
      },
      {
        metric: "grafana_process_network_receive_bytes",
        description: "Tracks the number of bytes received over the network by the Grafana process.",
        type: "counter",
        unit: "",
        help: "Number of bytes received by the process over the network."
      },
      {
        metric: "grafana_process_network_transmit_bytes",
        description: "Tracks the number of bytes sent over the network by the Grafana process.",
        type: "counter",
        unit: "",
        help: "Number of bytes sent by the process over the network."
      },
      {
        metric: "grafana_process_open_fds",
        description: "Shows the number of open file descriptors by the Grafana process.",
        type: "gauge",
        unit: "",
        help: "Number of open file descriptors."
      },
      {
        metric: "grafana_process_resident_memory_bytes",
        description: "Tracks the resident memory usage in bytes by the Grafana process.",
        type: "gauge",
        unit: "",
        help: "Resident memory size in bytes."
      },
      {
        metric: "grafana_process_start_time_seconds",
        description: "Indicates the start time of the Grafana process since the Unix epoch.",
        type: "gauge",
        unit: "",
        help: "Start time of the process since unix epoch in seconds."
      },
      {
        metric: "grafana_process_virtual_memory_bytes",
        description: "Tracks the virtual memory usage in bytes by the Grafana process.",
        type: "gauge",
        unit: "",
        help: "Virtual memory size in bytes."
      },
      {
        metric: "grafana_process_virtual_memory_max_bytes",
        description: "Shows the maximum virtual memory available in bytes.",
        type: "gauge",
        unit: "",
        help: "Maximum amount of virtual memory available in bytes."
      },
      {
        metric: "grafana_prometheus_plugin_backend_request_count",
        description: "Counts the total number of requests made to the Prometheus backend plugin.",
        type: "unknown",
        unit: "",
        help: "The total amount of prometheus backend plugin requests"
      },
      {
        metric: "grafana_proxy_response_status",
        description: "Tracks the HTTP response status for proxy requests.",
        type: "counter",
        unit: "",
        help: "proxy http response status"
      },
      {
        metric: "grafana_public_dashboard_request_count",
        description: "Counts the number of requests made to public dashboards in Grafana.",
        type: "unknown",
        unit: "",
        help: "counter for public dashboards requests"
      },
      {
        metric: "grafana_registered_metrics",
        description: "Counts the registered metrics, categorized by stability level and deprecation version.",
        type: "counter",
        unit: "",
        help: "[BETA] The count of registered metrics broken by stability level and deprecation version."
      },
      {
        metric: "grafana_rendering_queue_size",
        description: "Tracks the size of the rendering queue in Grafana.",
        type: "gauge",
        unit: "",
        help: "size of rendering queue"
      },
      {
        metric: "grafana_search_dashboard_search_failures_duration_seconds",
        description: "Measures the duration of failed dashboard search queries in seconds.",
        type: "histogram",
        unit: "",
        help: ""
      },
      {
        metric: "grafana_search_dashboard_search_successes_duration_seconds",
        description: "Measures the duration of successful dashboard search queries in seconds.",
        type: "histogram",
        unit: "",
        help: ""
      },
      {
        metric: "grafana_sse_ds_queries",
        description: "Counts the number of data source queries made via server-side expressions.",
        type: "counter",
        unit: "",
        help: "Number of datasource queries made via server side expression requests"
      },
      {
        metric: "grafana_stat_active_users",
        description: "Tracks the current number of active users in Grafana.",
        type: "gauge",
        unit: "",
        help: "number of active users"
      },
      {
        metric: "grafana_stat_total_orgs",
        description: "Counts the total number of organizations in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of orgs"
      },
      {
        metric: "grafana_stat_total_playlists",
        description: "Counts the total number of playlists created in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of playlists"
      },
      {
        metric: "grafana_stat_total_service_account_tokens",
        description: "Counts the total number of service account tokens.",
        type: "gauge",
        unit: "",
        help: "total amount of service account tokens"
      },
      {
        metric: "grafana_stat_total_service_accounts",
        description: "Counts the total number of service accounts.",
        type: "gauge",
        unit: "",
        help: "total amount of service accounts"
      },
      {
        metric: "grafana_stat_total_service_accounts_role_none",
        description: "Counts the total number of service accounts with no assigned roles.",
        type: "gauge",
        unit: "",
        help: "total amount of service accounts with no role"
      },
      {
        metric: "grafana_stat_total_teams",
        description: "Tracks the total number of teams in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of teams"
      },
      {
        metric: "grafana_stat_total_users",
        description: "Tracks the total number of users registered in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of users"
      },
      {
        metric: "grafana_stat_totals_active_admins",
        description: "Tracks the total number of active administrators in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of active admins"
      },
      {
        metric: "grafana_stat_totals_active_editors",
        description: "Tracks the total number of active editors in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of active editors"
      },
      {
        metric: "grafana_stat_totals_active_viewers",
        description: "Tracks the total number of active viewers in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of active viewers"
      },
      {
        metric: "grafana_stat_totals_admins",
        description: "Counts the total number of administrators in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of admins"
      },
      {
        metric: "grafana_stat_totals_alert_rules",
        description: "Counts the total number of alert rules configured in the database.",
        type: "gauge",
        unit: "",
        help: "total amount of alert rules in the database"
      },
      {
        metric: "grafana_stat_totals_annotations",
        description: "Counts the total number of annotations stored in the database.",
        type: "gauge",
        unit: "",
        help: "total amount of annotations in the database"
      },
      {
        metric: "grafana_stat_totals_correlations",
        description: "Tracks the total number of correlations recorded in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of correlations"
      },
      {
        metric: "grafana_stat_totals_dashboard",
        description: "Tracks the total number of dashboards created in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of dashboards"
      },
      {
        metric: "grafana_stat_totals_dashboard_versions",
        description: "Counts the total number of dashboard versions stored in the database.",
        type: "gauge",
        unit: "",
        help: "total amount of dashboard versions in the database"
      },
      {
        metric: "grafana_stat_totals_data_keys",
        description: "Tracks the total number of data keys in the database.",
        type: "gauge",
        unit: "",
        help: "total amount of data keys in the database"
      },
      {
        metric: "grafana_stat_totals_datasource",
        description: "Counts the total number of data sources defined, categorized by pluginId.",
        type: "gauge",
        unit: "",
        help: "total number of defined datasources, labeled by pluginId"
      },
      {
        metric: "grafana_stat_totals_editors",
        description: "Counts the total number of editors in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of editors"
      },
      {
        metric: "grafana_stat_totals_folder",
        description: "Tracks the total number of folders created in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of folders"
      },
      {
        metric: "grafana_stat_totals_library_panels",
        description: "Counts the total number of library panels stored in the database.",
        type: "gauge",
        unit: "",
        help: "total amount of library panels in the database"
      },
      {
        metric: "grafana_stat_totals_library_variables",
        description: "Tracks the total number of library variables in Grafana.",
        type: "gauge",
        unit: "",
        help: "total amount of library variables in the database"
      }, 
      {
        metric: "machine_cpu_sockets",
        description: "Number of CPU sockets on the machine.",
        type: "gauge",
        unit: "",
        help: "Number of CPU sockets."
      },
      {
        metric: "machine_memory_bytes",
        description: "Total amount of memory installed on the machine in bytes.",
        type: "gauge",
        unit: "bytes",
        help: "Amount of memory installed on the machine."
      },
      {
        metric: "machine_nvm_avg_power_budget_watts",
        description: "Average power budget for Non-Volatile Memory (NVM) in watts.",
        type: "gauge",
        unit: "watts",
        help: "NVM power budget."
      },
      {
        metric: "machine_nvm_capacity",
        description: "Capacity of NVM labeled by its mode (e.g., memory mode or app direct mode).",
        type: "gauge",
        unit: "bytes",
        help: "NVM capacity value labeled by NVM mode (memory mode or app direct mode)."
      },
      {
        metric: "machine_scrape_error",
        description: "Indicates whether an error occurred during machine metric scraping (1 for error, 0 for success).",
        type: "gauge",
        unit: "",
        help: "1 if there was an error while getting machine metrics, 0 otherwise."
      },
      {
        metric: "machine_swap_bytes",
        description: "Total amount of swap memory available on the machine in bytes.",
        type: "gauge",
        unit: "bytes",
        help: "Amount of swap memory available on the machine."
      },
      {
        metric: "net_conntrack_dialer_conn_attempted",
        description: "Total number of connection attempts made by a specific dialer.",
        type: "counter",
        unit: "",
        help: "Total number of connections attempted by the given dialer a given name."
      },
      {
        metric: "net_conntrack_dialer_conn_closed",
        description: "Total number of connections closed by a specific dialer.",
        type: "counter",
        unit: "",
        help: "Total number of connections closed which originated from the dialer of a given name."
      },
      {
        metric: "node_cpu_seconds_total",
        description: "Total seconds the CPUs have spent in each mode.",
        type: "counter",
        unit: "seconds",
        help: "Seconds the CPUs spent in each mode."
      },
      {
        metric: "node_disk_io_now",
        description: "Number of I/O operations currently in progress.",
        type: "gauge",
        unit: "",
        help: "The number of I/Os currently in progress."
      },
      {
        metric: "node_memory_CommitLimit_bytes",
        description: "Maximum amount of memory that can be allocated based on current system resources.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field CommitLimit_bytes."
      },
      {
        metric: "node_memory_Committed_AS_bytes",
        description: "Total amount of memory that has been promised to processes by the OS.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field Committed_AS_bytes."
      },
      {
        metric: "node_memory_DirectMap1G_bytes",
        description: "Memory mapped in 1GB pages for direct access.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field DirectMap1G_bytes."
      },
      {
        metric: "node_memory_DirectMap2M_bytes",
        description: "Memory mapped in 2MB pages for direct access.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field DirectMap2M_bytes."
      },
      {
        metric: "node_memory_DirectMap4k_bytes",
        description: "Memory mapped in 4KB pages for direct access.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field DirectMap4k_bytes."
      },
      {
        metric: "node_memory_Dirty_bytes",
        description: "Amount of memory waiting to be written back to disk.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field Dirty_bytes."
      },
      {
        metric: "node_memory_FileHugePages_bytes",
        description: "Size of huge pages in the file cache.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field FileHugePages_bytes."
      },
      {
        metric: "node_memory_FilePmdMapped_bytes",
        description: "Size of page middle directory (PMD) mapped files in memory.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field FilePmdMapped_bytes."
      },
      {
        metric: "node_memory_HardwareCorrupted_bytes",
        description: "Amount of memory marked as corrupted by hardware.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field HardwareCorrupted_bytes."
      },
      {
        metric: "node_memory_HugePages_Free",
        description: "Number of free huge pages available on the system.",
        type: "gauge",
        unit: "",
        help: "Memory information field HugePages_Free."
      },
      {
        metric: "node_memory_HugePages_Rsvd",
        description: "Number of huge pages reserved but not yet allocated.",
        type: "gauge",
        unit: "",
        help: "Memory information field HugePages_Rsvd."
      },
      {
        metric: "node_memory_HugePages_Surp",
        description: "Number of surplus huge pages allocated.",
        type: "gauge",
        unit: "",
        help: "Memory information field HugePages_Surp."
      },
      {
        metric: "node_memory_HugePages_Total",
        description: "Total number of huge pages configured on the system.",
        type: "gauge",
        unit: "",
        help: "Memory information field HugePages_Total."
      },
      {
        metric: "node_memory_Hugepagesize_bytes",
        description: "Size of each huge page in bytes.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field Hugepagesize_bytes."
      },
      {
        metric: "node_memory_Hugetlb_bytes",
        description: "Amount of memory used by huge pages.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field Hugetlb_bytes."
      },
      {
        metric: "node_memory_Inactive_anon_bytes",
        description: "Inactive anonymous memory, typically not backed by files.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field Inactive_anon_bytes."
      },
      {
        metric: "node_memory_Inactive_bytes",
        description: "Total amount of inactive memory.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field Inactive_bytes."
      },
      {
        metric: "node_memory_Inactive_file_bytes",
        description: "Inactive memory backed by files.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field Inactive_file_bytes."
      },
      {
        metric: "node_memory_KReclaimable_bytes",
        description: "Amount of kernel memory that can be reclaimed.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field KReclaimable_bytes."
      },
      {
        metric: "node_memory_KernelStack_bytes",
        description: "Memory used by the kernel stack.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field KernelStack_bytes."
      },
      {
        metric: "node_memory_Mapped_bytes",
        description: "Amount of memory mapped into process address space.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field Mapped_bytes."
      },
      {
        metric: "node_memory_MemAvailable_bytes",
        description: "Amount of memory available for use by applications.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field MemAvailable_bytes."
      },
      {
        metric: "node_memory_MemFree_bytes",
        description: "Amount of free memory available on the system.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field MemFree_bytes."
      },
      {
        metric: "node_memory_MemTotal_bytes",
        description: "Total physical memory available on the system.",
        type: "gauge",
        unit: "bytes",
        help: "Memory information field MemTotal_bytes."
      },
      {
        metric: "node_network_carrier_changes_total",
        description: "Total number of changes in the carrier state of a network device.",
        type: "counter",
        unit: "",
        help: "Network device property: carrier_changes_total"
      },
      {
        metric: "node_network_carrier_down_changes_total",
        description: "Total number of times the carrier state of a network device has changed to down.",
        type: "counter",
        unit: "",
        help: "Network device property: carrier_down_changes_total"
      },
      {
        metric: "node_network_carrier_up_changes_total",
        description: "Total number of times the carrier state of a network device has changed to up.",
        type: "counter",
        unit: "",
        help: "Network device property: carrier_up_changes_total"
      },
      {
        metric: "node_network_device_id",
        description: "Identifier for the network device.",
        type: "gauge",
        unit: "",
        help: "Network device property: device_id"
      },
      {
        metric: "node_network_dormant",
        description: "Indicates whether the network device is in a dormant state.",
        type: "gauge",
        unit: "",
        help: "Network device property: dormant"
      },
      {
        metric: "node_network_flags",
        description: "Flags representing the current status of the network device.",
        type: "gauge",
        unit: "",
        help: "Network device property: flags"
      },
      {
        metric: "node_network_iface_id",
        description: "Identifier for the network interface.",
        type: "gauge",
        unit: "",
        help: "Network device property: iface_id"
      },
      {
        metric: "node_network_iface_link",
        description: "Indicates whether the network interface link is active.",
        type: "gauge",
        unit: "",
        help: "Network device property: iface_link"
      },
      {
        metric: "node_network_iface_link_mode",
        description: "Mode of the network interface link.",
        type: "gauge",
        unit: "",
        help: "Network device property: iface_link_mode"
      },
      {
        metric: "node_network_info",
        description: "Non-numeric information from /sys/class/net/<iface>, value is always 1.",
        type: "gauge",
        unit: "",
        help: "Non-numeric data from /sys/class/net/<iface>, value is always 1."
      },
      {
        metric: "node_network_mtu_bytes",
        description: "Maximum Transmission Unit (MTU) in bytes for the network device.",
        type: "gauge",
        unit: "",
        help: "Network device property: mtu_bytes"
      },
      {
        metric: "node_network_name_assign_type",
        description: "Type of name assignment for the network device.",
        type: "gauge",
        unit: "",
        help: "Network device property: name_assign_type"
      },
      {
        metric: "node_network_net_dev_group",
        description: "Group number of the network device.",
        type: "gauge",
        unit: "",
        help: "Network device property: net_dev_group"
      },
      {
        metric: "node_network_protocol_type",
        description: "Protocol type used by the network device.",
        type: "gauge",
        unit: "",
        help: "Network device property: protocol_type"
      },
      {
        metric: "node_network_receive_bytes_total",
        description: "Total number of bytes received by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_bytes."
      },
      {
        metric: "node_network_receive_compressed_total",
        description: "Total number of compressed packets received by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_compressed."
      },
      {
        metric: "node_network_receive_drop_total",
        description: "Total number of dropped packets received by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_drop."
      },
      {
        metric: "node_network_receive_errs_total",
        description: "Total number of errors encountered while receiving packets on the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_errs."
      },
      {
        metric: "node_network_receive_fifo_total",
        description: "Total number of FIFO errors encountered while receiving packets on the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_fifo."
      },
      {
        metric: "node_network_receive_frame_total",
        description: "Total number of frame errors encountered while receiving packets on the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_frame."
      },
      {
        metric: "node_network_receive_multicast_total",
        description: "Total number of multicast packets received by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_multicast."
      },
      {
        metric: "node_network_receive_nohandler_total",
        description: "Total number of packets received by the network device without a handler.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_nohandler."
      },
      {
        metric: "node_network_receive_packets_total",
        description: "Total number of packets received by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic receive_packets."
      },
      {
        metric: "node_network_speed_bytes",
        description: "Speed of the network device in bytes per second.",
        type: "gauge",
        unit: "",
        help: "Network device property: speed_bytes"
      },
      {
        metric: "node_network_transmit_bytes_total",
        description: "Total number of bytes transmitted by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic transmit_bytes."
      },
      {
        metric: "node_network_transmit_carrier_total",
        description: "Total number of carrier errors encountered during transmission on the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic transmit_carrier."
      },
      {
        metric: "node_network_transmit_colls_total",
        description: "Total number of collisions encountered during transmission on the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic transmit_colls."
      },
      {
        metric: "node_network_transmit_compressed_total",
        description: "Total number of compressed packets transmitted by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic transmit_compressed."
      },
      {
        metric: "node_network_transmit_drop_total",
        description: "Total number of dropped packets transmitted by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic transmit_drop."
      },
      {
        metric: "node_network_transmit_errs_total",
        description: "Total number of errors encountered while transmitting packets on the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic transmit_errs."
      },
      {
        metric: "node_network_transmit_fifo_total",
        description: "Total number of FIFO errors encountered while transmitting packets on the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic transmit_fifo."
      },
      {
        metric: "node_network_transmit_packets_total",
        description: "Total number of packets transmitted by the network device.",
        type: "counter",
        unit: "",
        help: "Network device statistic transmit_packets."
      },
      {
        metric: "node_network_transmit_queue_length",
        description: "Length of the transmit queue for the network device.",
        type: "gauge",
        unit: "",
        help: "Network device property: transmit_queue_length"
      },
      {
        metric: "node_network_up",
        description: "Value is 1 if the network device is operational (state 'up'), otherwise 0.",
        type: "gauge",
        unit: "",
        help: "Value is 1 if operstate is 'up', 0 otherwise."
      },
      {
        metric: "node_nf_conntrack_entries",
        description: "Number of currently allocated flow entries for connection tracking.",
        type: "gauge",
        unit: "",
        help: "Number of currently allocated flow entries for connection tracking."
      },
      {
        metric: "node_nf_conntrack_entries_limit",
        description: "Maximum size of the connection tracking table.",
        type: "gauge",
        unit: "",
        help: "Maximum size of connection tracking table."
      },
      {
        metric: "node_os_info",
        description: "Information about the operating system, always labeled with build and version details.",
        type: "gauge",
        unit: "",
        help: "A metric with a constant '1' value labeled by build_id, id, id_like, image_id, image_version, name, pretty_name, variant, variant_id, version, version_codename, version_id."
      },
      {
        metric: "node_os_version",
        description: "Operating system version in major.minor format.",
        type: "gauge",
        unit: "",
        help: "Metric containing the major.minor part of the OS version."
      },
      {
        metric: "node_pressure_cpu_waiting_seconds_total",
        description: "Total time in seconds that processes have waited for CPU time.",
        type: "counter",
        unit: "",
        help: "Total time in seconds that processes have waited for CPU time"
      },
      {
        metric: "node_pressure_io_stalled_seconds_total",
        description: "Total time in seconds that no process could make progress due to IO congestion.",
        type: "counter",
        unit: "",
        help: "Total time in seconds no process could make progress due to IO congestion"
      },
      {
        metric: "node_pressure_io_waiting_seconds_total",
        description: "Total time in seconds that processes have waited due to IO congestion.",
        type: "counter",
        unit: "",
        help: "Total time in seconds that processes have waited due to IO congestion"
      },
      {
        metric: "node_pressure_memory_stalled_seconds_total",
        description: "Total time in seconds that no process could make progress due to memory congestion.",
        type: "counter",
        unit: "",
        help: "Total time in seconds no process could make progress due to memory congestion"
      },
      {
        metric: "node_pressure_memory_waiting_seconds_total",
        description: "Total time in seconds that processes have waited for memory resources.",
        type: "counter",
        unit: "",
        help: "Total time in seconds that processes have waited for memory"
      },
      {
        metric: "node_procs_blocked",
        description: "Number of processes blocked waiting for I/O to complete.",
        type: "gauge",
        unit: "",
        help: "Number of processes blocked waiting for I/O to complete."
      },
      {
        metric: "node_procs_running",
        description: "Number of processes currently in a runnable state.",
        type: "gauge",
        unit: "",
        help: "Number of processes in runnable state."
      },
      {
        metric: "node_schedstat_running_seconds_total",
        description: "Total time in seconds that the CPU spent running processes.",
        type: "counter",
        unit: "",
        help: "Number of seconds CPU spent running a process."
      },
      {
        metric: "node_schedstat_timeslices_total",
        description: "Total number of timeslices executed by the CPU.",
        type: "counter",
        unit: "",
        help: "Number of timeslices executed by CPU."
      },
      {
        metric: "node_schedstat_waiting_seconds_total",
        description: "Total time in seconds that processes waited for the CPU.",
        type: "counter",
        unit: "",
        help: "Number of seconds spent by processing waiting for this CPU."
      },
      {
        metric: "node_scrape_collector_duration_seconds",
        description: "Duration in seconds of a node_exporter collector scrape.",
        type: "gauge",
        unit: "",
        help: "node_exporter: Duration of a collector scrape."
      },
      {
        metric: "node_scrape_collector_success",
        description: "Indicates whether a node_exporter collector succeeded (1 for success, 0 for failure).",
        type: "gauge",
        unit: "",
        help: "node_exporter: Whether a collector succeeded."
      },
      {
        metric: "node_selinux_enabled",
        description: "Indicates if SELinux is enabled (1 for true, 0 for false).",
        type: "gauge",
        unit: "",
        help: "SELinux is enabled, 1 is true, 0 is false"
      },
      {
        metric: "node_sockstat_FRAG6_inuse",
        description: "Number of FRAG6 sockets currently in use.",
        type: "gauge",
        unit: "",
        help: "Number of FRAG6 sockets in state inuse."
      },
      {
        metric: "node_sockstat_FRAG6_memory",
        description: "Amount of memory used by FRAG6 sockets.",
        type: "gauge",
        unit: "",
        help: "Number of FRAG6 sockets in state memory."
      },
      {
        metric: "node_sockstat_FRAG_inuse",
        description: "Number of FRAG sockets currently in use.",
        type: "gauge",
        unit: "",
        help: "Number of FRAG sockets in state inuse."
      },
      {
        metric: "node_sockstat_FRAG_memory",
        description: "Amount of memory used by FRAG sockets.",
        type: "gauge",
        unit: "",
        help: "Number of FRAG sockets in state memory."
      },
      {
        metric: "node_sockstat_RAW6_inuse",
        description: "Number of RAW6 sockets currently in use.",
        type: "gauge",
        unit: "",
        help: "Number of RAW6 sockets in state inuse."
      },
      {
        metric: "node_sockstat_RAW_inuse",
        description: "Number of RAW sockets in state inuse.",
        type: "gauge",
        unit: "",
        help: "Number of RAW sockets in state inuse."
      },
      {
        metric: "node_sockstat_TCP6_inuse",
        description: "Number of TCP6 sockets in state inuse.",
        type: "gauge",
        unit: "",
        help: "Number of TCP6 sockets in state inuse."
      },
      {
        metric: "node_sockstat_TCP_alloc",
        description: "Number of TCP sockets in state alloc.",
        type: "gauge",
        unit: "",
        help: "Number of TCP sockets in state alloc."
      },
      {
        metric: "node_sockstat_TCP_inuse",
        description: "Number of TCP sockets in state inuse.",
        type: "gauge",
        unit: "",
        help: "Number of TCP sockets in state inuse."
      },
      {
        metric: "node_sockstat_TCP_mem",
        description: "Number of TCP sockets in state mem.",
        type: "gauge",
        unit: "",
        help: "Number of TCP sockets in state mem."
      },
      {
        metric: "node_sockstat_TCP_mem_bytes",
        description: "Number of TCP sockets in state mem_bytes.",
        type: "gauge",
        unit: "",
        help: "Number of TCP sockets in state mem_bytes."
      },
      {
        metric: "node_sockstat_TCP_orphan",
        description: "Number of TCP sockets in state orphan.",
        type: "gauge",
        unit: "",
        help: "Number of TCP sockets in state orphan."
      },
      {
        metric: "node_sockstat_TCP_tw",
        description: "Number of TCP sockets in state tw.",
        type: "gauge",
        unit: "",
        help: "Number of TCP sockets in state tw."
      },
      {
        metric: "node_sockstat_UDP6_inuse",
        description: "Number of UDP6 sockets in state inuse.",
        type: "gauge",
        unit: "",
        help: "Number of UDP6 sockets in state inuse."
      },
      {
        metric: "node_sockstat_UDPLITE6_inuse",
        description: "Number of UDPLITE6 sockets in state inuse.",
        type: "gauge",
        unit: "",
        help: "Number of UDPLITE6 sockets in state inuse."
      },
      {
        metric: "node_sockstat_UDPLITE_inuse",
        description: "Number of UDPLITE sockets in state inuse.",
        type: "gauge",
        unit: "",
        help: "Number of UDPLITE sockets in state inuse."
      },
      {
        metric: "node_sockstat_UDP_inuse",
        description: "Number of UDP sockets in state inuse.",
        type: "gauge",
        unit: "",
        help: "Number of UDP sockets in state inuse."
      },
      {
        metric: "node_sockstat_UDP_mem",
        description: "Number of UDP sockets in state mem.",
        type: "gauge",
        unit: "",
        help: "Number of UDP sockets in state mem."
      },
      {
        metric: "node_sockstat_UDP_mem_bytes",
        description: "Number of UDP sockets in state mem_bytes.",
        type: "gauge",
        unit: "",
        help: "Number of UDP sockets in state mem_bytes."
      },
      {
        metric: "node_sockstat_sockets_used",
        description: "Number of IPv4 sockets in use.",
        type: "gauge",
        unit: "",
        help: "Number of IPv4 sockets in use."
      },
      {
        metric: "node_softnet_backlog_len",
        description: "Softnet backlog status.",
        type: "gauge",
        unit: "",
        help: "Softnet backlog status."
      },
      {
        metric: "node_softnet_cpu_collision_total",
        description: "Number of collisions occurring while obtaining device lock during transmission.",
        type: "counter",
        unit: "",
        help: "Number of collisions occurring while obtaining device lock during transmission."
      },
      {
        metric: "node_softnet_dropped_total",
        description: "Number of dropped packets.",
        type: "counter",
        unit: "",
        help: "Number of dropped packets."
      },
      {
        metric: "node_softnet_flow_limit_count_total",
        description: "Number of times flow limit has been reached.",
        type: "counter",
        unit: "",
        help: "Number of times flow limit has been reached."
      },
      {
        metric: "node_softnet_processed_total",
        description: "Number of processed packets.",
        type: "counter",
        unit: "",
        help: "Number of processed packets."
      },
      {
        metric: "openfga_condition_compilation_duration_ms",
        description: "A histogram measuring the compilation time of a condition.",
        type: "histogram",
        unit: "ms",
        help: "A histogram measuring the compilation time (in milliseconds) of a Condition."
      },
      {
        metric: "openfga_condition_evaluation_cost",
        description: "A histogram of the CEL evaluation cost of a condition in a relationship tuple.",
        type: "histogram",
        unit: "",
        help: "A histogram of the CEL evaluation cost of a Condition in a Relationship Tuple."
      },
      {
        metric: "openfga_condition_evaluation_duration_ms",
        description: "A histogram measuring the evaluation time of a condition.",
        type: "histogram",
        unit: "ms",
        help: "A histogram measuring the evaluation time (in milliseconds) of a Condition."
      },
      {
        metric: "openfga_list_objects_further_eval_required_count",
        description: "Number of objects in a ListObjects call requiring further evaluation.",
        type: "unknown",
        unit: "",
        help: "Number of objects in a ListObjects call that needed to issue a Check call to determine a final result."
      },
      {
        metric: "openfga_list_objects_no_further_eval_required_count",
        description: "Number of objects in a ListObjects call with no further evaluation needed.",
        type: "unknown",
        unit: "",
        help: "Number of objects in a ListObjects call that did not require further evaluation."
      },
      {
        metric: "plugins_active_instances",
        description: "The current number of active plugin instances.",
        type: "gauge",
        unit: "",
        help: "The number of active plugin instances."
      },
      {
        metric: "plugins_datasource_instances",
        description: "Total number of data source instances created.",
        type: "counter",
        unit: "",
        help: "The total number of data source instances created."
      },
      {
        metric: "probe_dns_lookup_time_seconds",
        description: "The time taken for a probe DNS lookup in seconds.",
        type: "gauge",
        unit: "seconds",
        help: "Returns the time taken for probe dns lookup in seconds."
      },
      {
        metric: "probe_duration_seconds",
        description: "Time duration for the probe to complete in seconds.",
        type: "gauge",
        unit: "seconds",
        help: "Returns how long the probe took to complete in seconds."
      },
      {
        metric: "probe_failed_due_to_regex",
        description: "Indicates if the probe failed due to a regex error.",
        type: "gauge",
        unit: "",
        help: "Indicates if probe failed due to regex."
      },
      {
        metric: "probe_http_content_length",
        description: "Length of the HTTP content response.",
        type: "gauge",
        unit: "bytes",
        help: "Length of http content response."
      },
      {
        metric: "probe_http_duration_seconds",
        description: "Duration of the HTTP request by phase, summed over all redirects.",
        type: "gauge",
        unit: "seconds",
        help: "Duration of http request by phase, summed over all redirects."
      },
      {
        metric: "probe_http_redirects",
        description: "The number of HTTP redirects encountered.",
        type: "gauge",
        unit: "",
        help: "The number of redirects."
      },
      {
        metric: "probe_http_ssl",
        description: "Indicates whether SSL was used for the final HTTP redirect.",
        type: "gauge",
        unit: "",
        help: "Indicates if SSL was used for the final redirect."
      },
      {
        metric: "probe_http_status_code",
        description: "HTTP response status code.",
        type: "gauge",
        unit: "",
        help: "Response HTTP status code."
      },
      {
        metric: "probe_http_uncompressed_body_length",
        description: "Length of the uncompressed HTTP response body.",
        type: "gauge",
        unit: "bytes",
        help: "Length of uncompressed response body."
      },
      {
        metric: "probe_http_version",
        description: "The HTTP version of the probe response.",
        type: "gauge",
        unit: "",
        help: "Returns the version of HTTP of the probe response."
      },
      {
        metric: "probe_ip_addr_hash",
        description: "Hash of the IP address used in the probe.",
        type: "gauge",
        unit: "",
        help: "Specifies the hash of IP address. It's useful to detect if the IP address changes."
      },
      {
        metric: "probe_ip_protocol",
        description: "IP protocol version (IPv4 or IPv6) used for the probe.",
        type: "gauge",
        unit: "",
        help: "Specifies whether probe ip protocol is IP4 or IP6."
      },
      {
        metric: "probe_success",
        description: "Indicates if the probe was successful.",
        type: "gauge",
        unit: "",
        help: "Displays whether or not the probe was a success."
      },
      {
        metric: "process_cpu_seconds",
        description: "Total CPU time used by the process in seconds.",
        type: "counter",
        unit: "seconds",
        help: "Total user and system CPU time spent in seconds."
      },
      {
        metric: "process_cpu_seconds_total",
        description: "Total CPU time spent (user and system) in seconds.",
        type: "counter",
        unit: "seconds",
        help: "Total user and system CPU time spent in seconds."
      },
      {
        metric: "process_max_fds",
        description: "Maximum number of file descriptors the process can open.",
        type: "gauge",
        unit: "",
        help: "Maximum number of open file descriptors."
      },
      {
        metric: "prometheus_rule_group_last_evaluation_timestamp_seconds",
        description: "Timestamp of the most recent rule group evaluation.",
        type: "gauge",
        unit: "",
        help: "The timestamp of the last rule group evaluation in seconds."
      },
      {
        metric: "prometheus_rule_group_last_restore_duration_seconds",
        description: "Duration of the last restoration of alert rules using ALERTS_FOR_STATE.",
        type: "gauge",
        unit: "",
        help: "The duration of the last alert rules alerts restoration using the `ALERTS_FOR_STATE` series."
      },
      {
        metric: "prometheus_rule_group_rules",
        description: "Total number of rules in a rule group.",
        type: "gauge",
        unit: "",
        help: "The number of rules."
      },
      {
        metric: "prometheus_sd_azure_cache_hit_total",
        description: "Count of cache hits during Azure service discovery refresh.",
        type: "counter",
        unit: "",
        help: "Number of cache hit during refresh."
      },
      {
        metric: "prometheus_sd_azure_failures_total",
        description: "Total failures during Azure service discovery refresh.",
        type: "counter",
        unit: "",
        help: "Number of Azure service discovery refresh failures."
      },
      {
        metric: "prometheus_sd_consul_rpc_duration_seconds",
        description: "Time taken for Consul RPC calls in seconds.",
        type: "summary",
        unit: "",
        help: "The duration of a Consul RPC call in seconds."
      },
      {
        metric: "prometheus_sd_consul_rpc_failures_total",
        description: "Total number of Consul RPC call failures.",
        type: "counter",
        unit: "",
        help: "The number of Consul RPC call failures."
      },
      {
        metric: "prometheus_sd_discovered_targets",
        description: "Current count of targets discovered by service discovery.",
        type: "gauge",
        unit: "",
        help: "Current number of discovered targets."
      },
      {
        metric: "prometheus_sd_dns_lookup_failures_total",
        description: "Total number of DNS-SD lookup failures encountered.",
        type: "counter",
        unit: "",
        help: "The number of DNS-SD lookup failures."
      },
      {
        metric: "prometheus_sd_dns_lookups_total",
        description: "Count of all DNS-SD lookups performed.",
        type: "counter",
        unit: "",
        help: "The number of DNS-SD lookups."
      },
      {
        metric: "prometheus_sd_failed_configs",
        description: "Count of service discovery configurations that failed to load.",
        type: "gauge",
        unit: "",
        help: "Current number of service discovery configurations that failed to load."
      },
      {
        metric: "prometheus_sd_file_mtime_seconds",
        description: "Last modification time of files read by FileSD in seconds.",
        type: "gauge",
        unit: "",
        help: "Timestamp (mtime) of files read by FileSD. Timestamp is set at read time."
      },
      {
        metric: "prometheus_sd_file_read_errors_total",
        description: "Total number of errors encountered while reading files in FileSD.",
        type: "counter",
        unit: "",
        help: "The number of File-SD read errors."
      },
      {
        metric: "prometheus_sd_file_scan_duration_seconds",
        description: "Duration of the File-SD scan in seconds.",
        type: "summary",
        unit: "",
        help: "The duration of the File-SD scan in seconds."
      },
      {
        metric: "prometheus_sd_file_watcher_errors_total",
        description: "Number of File-SD errors due to filesystem watch failures.",
        type: "counter",
        unit: "",
        help: "The number of File-SD errors caused by filesystem watch failures."
      },
      {
        metric: "prometheus_sd_http_failures_total",
        description: "Count of HTTP service discovery refresh failures.",
        type: "counter",
        unit: "",
        help: "Number of HTTP service discovery refresh failures."
      },
      {
        metric: "prometheus_sd_kubernetes_events_total",
        description: "Total number of Kubernetes events handled during service discovery.",
        type: "counter",
        unit: "",
        help: "The number of Kubernetes events handled."
      },
      {
        metric: "prometheus_sd_kubernetes_failures_total",
        description: "Total failures for WATCH or LIST requests in Kubernetes service discovery.",
        type: "counter",
        unit: "",
        help: "The number of failed WATCH/LIST requests."
      },
      {
        metric: "prometheus_sd_kuma_fetch_duration_seconds",
        description: "Time taken for Kuma MADS fetch calls in seconds.",
        type: "summary",
        unit: "",
        help: "The duration of a Kuma MADS fetch call."
      },
      {
        metric: "prometheus_sd_kuma_fetch_failures_total",
        description: "Count of failed Kuma MADS fetch calls.",
        type: "counter",
        unit: "",
        help: "The number of Kuma MADS fetch call failures."
      },
      {
        metric: "prometheus_sd_kuma_fetch_skipped_updates_total",
        description: "Count of Kuma MADS fetch calls that resulted in no updates.",
        type: "counter",
        unit: "",
        help: "The number of Kuma MADS fetch calls that result in no updates to the targets."
      },
      {
        metric: "prometheus_sd_linode_failures_total",
        description: "Total failures during Linode service discovery refresh.",
        type: "counter",
        unit: "",
        help: "Number of Linode service discovery refresh failures."
      },
      {
        metric: "prometheus_sd_nomad_failures_total",
        description: "Count of Nomad service discovery refresh failures.",
        type: "counter",
        unit: "",
        help: "Number of nomad service discovery refresh failures."
      },
      {
        metric: "prometheus_sd_received_updates_total",
        description: "Total number of update events received from service discovery providers.",
        type: "counter",
        unit: "",
        help: "Total number of update events received from the SD providers."
      },
      {
        metric: "prometheus_sd_updates_delayed_total",
        description: "Count of update events that were delayed.",
        type: "counter",
        unit: "",
        help: "Total number of update events that couldn't be sent immediately."
      },
      {
        metric: "prometheus_sd_updates_total",
        description: "Total number of update events sent to service discovery consumers.",
        type: "counter",
        unit: "",
        help: "Total number of update events sent to the SD consumers."
      },
      {
        metric: "prometheus_target_interval_length_seconds",
        description: "Actual interval lengths between scrapes.",
        type: "summary",
        unit: "",
        help: "Actual intervals between scrapes."
      },
      {
        metric: "prometheus_target_metadata_cache_bytes",
        description: "Current size of metric metadata cache in bytes.",
        type: "gauge",
        unit: "",
        help: "The number of bytes that are currently used for storing metric metadata in the cache"
      },
      {
        metric: "prometheus_target_metadata_cache_entries",
        description: "Total number of metadata entries in the metric cache.",
        type: "gauge",
        unit: "",
        help: "Total number of metric metadata entries in the cache"
      },
      {
        metric: "prometheus_target_scrapes_exceeded_native_histogram_bucket_limit_total",
        description: "Total number of scrapes that hit the native histogram bucket limit and were rejected.",
        type: "counter",
        unit: "",
        help: "Total number of scrapes that hit the native histogram bucket limit and were rejected."
      },
      {
        metric: "prometheus_target_scrapes_exceeded_sample_limit_total",
        description: "Total number of scrapes that hit the sample limit and were rejected.",
        type: "counter",
        unit: "",
        help: "Total number of scrapes that hit the sample limit and were rejected."
      },
      {
        metric: "prometheus_target_scrapes_exemplar_out_of_order_total",
        description: "Total number of exemplar rejected due to not being out of the expected order.",
        type: "counter",
        unit: "",
        help: "Total number of exemplar rejected due to not being out of the expected order."
      },
      {
        metric: "prometheus_target_scrapes_sample_duplicate_timestamp_total",
        description: "Total number of samples rejected due to duplicate timestamps but different values.",
        type: "counter",
        unit: "",
        help: "Total number of samples rejected due to duplicate timestamps but different values."
      },
      {
        metric: "prometheus_target_scrapes_sample_out_of_bounds_total",
        description: "Total number of samples rejected due to timestamp falling outside of the time bounds.",
        type: "counter",
        unit: "",
        help: "Total number of samples rejected due to timestamp falling outside of the time bounds."
      },
      {
        metric: "prometheus_target_scrapes_sample_out_of_order_total",
        description: "Total number of samples rejected due to not being out of the expected order.",
        type: "counter",
        unit: "",
        help: "Total number of samples rejected due to not being out of the expected order."
      },
      {
        metric: "prometheus_target_sync_failed_total",
        description: "Total number of target sync failures.",
        type: "counter",
        unit: "",
        help: "Total number of target sync failures."
      },
      {
        metric: "prometheus_target_sync_length_seconds",
        description: "Actual interval to sync the scrape pool.",
        type: "summary",
        unit: "",
        help: "Actual interval to sync the scrape pool."
      },
      {
        metric: "prometheus_template_text_expansion_failures",
        description: "The total number of template text expansion failures.",
        type: "counter",
        unit: "",
        help: "The total number of template text expansion failures."
      },
      {
        metric: "prometheus_template_text_expansion_failures_total",
        description: "The total number of template text expansion failures.",
        type: "counter",
        unit: "",
        help: "The total number of template text expansion failures."
      },
      {
        metric: "prometheus_template_text_expansions",
        description: "The total number of template text expansions.",
        type: "counter",
        unit: "",
        help: "The total number of template text expansions."
      },
      {
        metric: "prometheus_template_text_expansions_total",
        description: "The total number of template text expansions.",
        type: "counter",
        unit: "",
        help: "The total number of template text expansions."
      },
      {
        metric: "prometheus_treecache_watcher_goroutines",
        description: "The current number of watcher goroutines.",
        type: "gauge",
        unit: "",
        help: "The current number of watcher goroutines."
      },
      {
        metric: "prometheus_treecache_zookeeper_failures_total",
        description: "The total number of ZooKeeper failures.",
        type: "counter",
        unit: "",
        help: "The total number of ZooKeeper failures."
      },
      {
        metric: "prometheus_tsdb_blocks_loaded",
        description: "Number of currently loaded data blocks.",
        type: "gauge",
        unit: "",
        help: "Number of currently loaded data blocks."
      },
      {
        metric: "prometheus_tsdb_checkpoint_creations_failed_total",
        description: "Total number of checkpoint creations that failed.",
        type: "counter",
        unit: "",
        help: "Total number of checkpoint creations that failed."
      },
      {
        metric: "prometheus_tsdb_checkpoint_creations_total",
        description: "Total number of checkpoint creations attempted.",
        type: "counter",
        unit: "",
        help: "Total number of checkpoint creations attempted."
      },
      {
        metric: "prometheus_tsdb_checkpoint_deletions_failed_total",
        description: "Total number of checkpoint deletions that failed.",
        type: "counter",
        unit: "",
        help: "Total number of checkpoint deletions that failed."
      },
      {
        metric: "prometheus_tsdb_checkpoint_deletions_total",
        description: "Total number of checkpoint deletions attempted.",
        type: "counter",
        unit: "",
        help: "Total number of checkpoint deletions attempted."
      },
      {
        metric: "prometheus_tsdb_clean_start",
        description: "-1: lockfile is disabled. 0: a lockfile from a previous execution was replaced. 1: lockfile creation was clean.",
        type: "gauge",
        unit: "",
        help: "-1: lockfile is disabled. 0: a lockfile from a previous execution was replaced. 1: lockfile creation was clean."
      },
      {
        metric: "prometheus_tsdb_head_chunks_storage_size_bytes",
        description: "Size of the chunks_head directory in bytes.",
        type: "gauge",
        unit: "bytes",
        help: "Size of the chunks_head directory."
      },
      {
        metric: "prometheus_tsdb_head_gc_duration_seconds",
        description: "Time taken for garbage collection in the head block.",
        type: "summary",
        unit: "seconds",
        help: "Runtime of garbage collection in the head block."
      },
      {
        metric: "prometheus_tsdb_head_max_time",
        description: "Maximum timestamp value in the head block.",
        type: "gauge",
        unit: "",
        help: "Maximum timestamp of the head block. The unit is decided by the library consumer."
      },
      {
        metric: "prometheus_tsdb_head_max_time_seconds",
        description: "Maximum timestamp value in the head block in seconds.",
        type: "gauge",
        unit: "seconds",
        help: "Maximum timestamp of the head block."
      },
      {
        metric: "prometheus_tsdb_head_min_time",
        description: "Minimum timestamp value in the head block.",
        type: "gauge",
        unit: "",
        help: "Minimum time bound of the head block. The unit is decided by the library consumer."
      },
      {
        metric: "prometheus_tsdb_head_min_time_seconds",
        description: "Minimum timestamp value in the head block in seconds.",
        type: "gauge",
        unit: "seconds",
        help: "Minimum time bound of the head block."
      },
      {
        metric: "prometheus_tsdb_head_out_of_order_samples_appended_total",
        description: "Total count of out-of-order samples appended.",
        type: "counter",
        unit: "",
        help: "Total number of appended out of order samples."
      },
      {
        metric: "prometheus_tsdb_head_samples_appended_total",
        description: "Total count of samples appended to the head block.",
        type: "counter",
        unit: "",
        help: "Total number of appended samples."
      },
      {
        metric: "prometheus_tsdb_head_series",
        description: "Total number of series in the head block.",
        type: "gauge",
        unit: "",
        help: "Total number of series in the head block."
      },
      {
        metric: "prometheus_tsdb_head_series_created_total",
        description: "Total count of series created in the head block.",
        type: "counter",
        unit: "",
        help: "Total number of series created in the head."
      },
      {
        metric: "prometheus_tsdb_head_series_not_found_total",
        description: "Total count of series lookup failures in the head block.",
        type: "counter",
        unit: "",
        help: "Total number of requests for series that were not found."
      },
      {
        metric: "prometheus_tsdb_head_series_removed_total",
        description: "Total count of series removed from the head block.",
        type: "counter",
        unit: "",
        help: "Total number of series removed in the head."
      },
      {
        metric: "prometheus_tsdb_head_truncations_failed_total",
        description: "Total count of failed head truncation attempts.",
        type: "counter",
        unit: "",
        help: "Total number of head truncations that failed."
      },
      {
        metric: "prometheus_tsdb_head_truncations_total",
        description: "Total count of head truncation attempts.",
        type: "counter",
        unit: "",
        help: "Total number of head truncations attempted."
      },
      {
        metric: "prometheus_tsdb_isolation_high_watermark",
        description: "Highest TSDB append ID issued so far.",
        type: "gauge",
        unit: "",
        help: "The highest TSDB append ID that has been given out."
      },
      {
        metric: "prometheus_tsdb_isolation_low_watermark",
        description: "Lowest TSDB append ID still in use.",
        type: "gauge",
        unit: "",
        help: "The lowest TSDB append ID that is still referenced."
      },
      {
        metric: "prometheus_tsdb_lowest_timestamp",
        description: "Lowest timestamp value in the database.",
        type: "gauge",
        unit: "",
        help: "Lowest timestamp value stored in the database. The unit is decided by the library consumer."
      },
      {
        metric: "prometheus_tsdb_lowest_timestamp_seconds",
        description: "Lowest timestamp value in the database in seconds.",
        type: "gauge",
        unit: "seconds",
        help: "Lowest timestamp value stored in the database."
      }                 
  ];
  
  export default metrics;
  
  