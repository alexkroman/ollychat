export const examples = [
  {
    question: "What is the rate of CPU pressure on the node?",
    query: "irate(node_pressure_cpu_waiting_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of memory pressure on the node?",
    query: "irate(node_pressure_memory_waiting_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of IO pressure on the node?",
    query: "irate(node_pressure_io_waiting_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the CPU usage percentage on the node?",
    query: "100 * (1 - avg(rate(node_cpu_seconds_total{{mode=\"idle\", instance=\"$node\"}}[5m])))"
  },
  {
    question: "What is the 1-minute load average percentage on the node?",
    query: "scalar(node_load1{{instance=\"$node\",job=\"$job\"}}) * 100 / count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu))"
  },
  {
    question: "What percentage of total memory is in use?",
    query: "((node_memory_MemTotal_bytes{{instance=\"$node\", job=\"$job\"}} - node_memory_MemFree_bytes{{instance=\"$node\", job=\"$job\"}}) / node_memory_MemTotal_bytes{{instance=\"$node\", job=\"$job\"}}) * 100"
  },
  {
    question: "What percentage of memory is unavailable?",
    query: "(1 - (node_memory_MemAvailable_bytes{{instance=\"$node\", job=\"$job\"}} / node_memory_MemTotal_bytes{{instance=\"$node\", job=\"$job\"}})) * 100"
  },
  {
    question: "What percentage of swap memory is in use?",
    query: "((node_memory_SwapTotal_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_SwapFree_bytes{{instance=\"$node\",job=\"$job\"}}) / (node_memory_SwapTotal_bytes{{instance=\"$node\",job=\"$job\"}})) * 100"
  },
  {
    question: "What is the percentage of used filesystem space on the root mount?",
    query: "100 - ((node_filesystem_avail_bytes{{instance=\"$node\",job=\"$job\",mountpoint=\"/\",fstype!=\"rootfs\"}} * 100) / node_filesystem_size_bytes{{instance=\"$node\",job=\"$job\",mountpoint=\"/\",fstype!=\"rootfs\"}})"
  },
  {
    question: "How many CPU cores are available on the node?",
    query: "count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu))"
  },
  {
    question: "How long has the node been running since the last boot?",
    query: "node_time_seconds{{instance=\"$node\",job=\"$job\"}} - node_boot_time_seconds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total size of the root filesystem?",
    query: "node_filesystem_size_bytes{{instance=\"$node\",job=\"$job\",mountpoint=\"/\",fstype!=\"rootfs\"}}"
  },
  {
    question: "What is the total memory available on the node?",
    query: "node_memory_MemTotal_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total swap memory available on the node?",
    query: "node_memory_SwapTotal_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the average system CPU usage across all cores?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"system\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the average user CPU usage across all cores?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"user\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the average IO wait CPU usage across all cores?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"iowait\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the average IRQ and softIRQ CPU usage across all cores?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=~\".*irq\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the average CPU usage across all cores for other modes?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\",  mode!='idle',mode!='user',mode!='system',mode!='iowait',mode!='irq',mode!='softirq'}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the average idle CPU usage across all cores?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"idle\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "How much memory is actively in use (excluding cached and buffered)?",
    query: "node_memory_MemTotal_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_MemFree_bytes{{instance=\"$node\",job=\"$job\"}} - (node_memory_Cached_bytes{{instance=\"$node\",job=\"$job\"}} + node_memory_Buffers_bytes{{instance=\"$node\",job=\"$job\"}} + node_memory_SReclaimable_bytes{{instance=\"$node\",job=\"$job\"}})"
  },
  {
    question: "How much memory is used for caching and buffers?",
    query: "node_memory_Cached_bytes{{instance=\"$node\",job=\"$job\"}} + node_memory_Buffers_bytes{{instance=\"$node\",job=\"$job\"}} + node_memory_SReclaimable_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much free memory is available on the node?",
    query: "node_memory_MemFree_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much swap memory is currently used?",
    query: "(node_memory_SwapTotal_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_SwapFree_bytes{{instance=\"$node\",job=\"$job\"}})"
  },
  {
    question: "What is the current network receive rate in bits per second for a specific node and job?",
    query: "irate(node_network_receive_bytes_total{{instance=\"$node\",job=\"$job\"}}[5m])*8"
  },
  {
    question: "What is the current network transmit rate in bits per second for a specific node and job?",
    query: "irate(node_network_transmit_bytes_total{{instance=\"$node\",job=\"$job\"}}[5m])*8"
  },
  {
    question: "What percentage of filesystem space is used on non-root filesystems for a specific node and job?",
    query: "100 - ((node_filesystem_avail_bytes{{instance=\"$node\",job=\"$job\",device!~'rootfs'}} * 100) / node_filesystem_size_bytes{{instance=\"$node\",job=\"$job\",device!~'rootfs'}})"
  },
  {
    question: "What is the system CPU usage rate for a specific node and job?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"system\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the user CPU usage rate for a specific node and job?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"user\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the nice CPU usage rate for a specific node and job?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"nice\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the iowait CPU usage rate for a specific node and job?",
    query: "sum by(instance) (irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"iowait\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the irq CPU usage rate for a specific node and job?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"irq\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the softirq CPU usage rate for a specific node and job?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"softirq\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the steal CPU usage rate for a specific node and job?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"steal\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the idle CPU usage rate for a specific node and job?",
    query: "sum(irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"idle\"}}[5m])) / scalar(count(count(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}) by (cpu)))"
  },
  {
    question: "What is the total used memory in bytes for a specific node and job?",
    query: "node_memory_MemTotal_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_MemFree_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_Buffers_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_Cached_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_Slab_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_PageTables_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_SwapCached_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of page tables in bytes for a specific node and job?",
    query: "node_memory_PageTables_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of cached swap memory in bytes for a specific node and job?",
    query: "node_memory_SwapCached_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of slab memory in bytes for a specific node and job?",
    query: "node_memory_Slab_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of cached memory in bytes for a specific node and job?",
    query: "node_memory_Cached_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of buffer memory in bytes for a specific node and job?",
    query: "node_memory_Buffers_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of free memory in bytes for a specific node and job?",
    query: "node_memory_MemFree_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total used swap memory in bytes for a specific node and job?",
    query: "(node_memory_SwapTotal_bytes{{instance=\"$node\",job=\"$job\"}} - node_memory_SwapFree_bytes{{instance=\"$node\",job=\"$job\"}})"
  },
  {
    question: "What is the size of hardware corrupted memory in bytes for a specific node and job?",
    query: "node_memory_HardwareCorrupted_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total size of used disk space in bytes for non-root filesystems for a specific node and job?",
    query: "node_filesystem_size_bytes{{instance=\"$node\",job=\"$job\",device!~'rootfs'}} - node_filesystem_avail_bytes{{instance=\"$node\",job=\"$job\",device!~'rootfs'}}"
  },
  {
    question: "What is the rate of disk reads completed per second for specific disk devices and a specific node and job?",
    query: "irate(node_disk_reads_completed_total{{instance=\"$node\",job=\"$job\",device=~\"$diskdevices\"}}[5m])"
  },
  {
    question: "What is the rate of disk writes completed per second for specific disk devices and a specific node and job?",
    query: "irate(node_disk_writes_completed_total{{instance=\"$node\",job=\"$job\",device=~\"$diskdevices\"}}[5m])"
  },
  {
    question: "What is the rate of disk read bytes per second for specific disk devices and a specific node and job?",
    query: "irate(node_disk_read_bytes_total{{instance=\"$node\",job=\"$job\",device=~\"$diskdevices\"}}[5m])"
  },
  {
    question: "What is the rate of disk write bytes per second for specific disk devices and a specific node and job?",
    query: "irate(node_disk_written_bytes_total{{instance=\"$node\",job=\"$job\",device=~\"$diskdevices\"}}[5m])"
  },
  {
    question: "What is the disk IO time rate in seconds per second for specific disk devices and a specific node and job?",
    query: "irate(node_disk_io_time_seconds_total{{instance=\"$node\",job=\"$job\",device=~\"$diskdevices\"}} [5m])"
  },
  {
    question: "What is the percentage of user mode guest CPU usage for a specific node and job?",
    query: "sum by(instance) (irate(node_cpu_guest_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"user\"}}[1m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}[1m])))"
  },
  {
    question: "What is the percentage of nice mode guest CPU usage for a specific node and job?",
    query: "sum by(instance) (irate(node_cpu_guest_seconds_total{{instance=\"$node\",job=\"$job\", mode=\"nice\"}}[1m])) / on(instance) group_left sum by (instance)((irate(node_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}[1m])))"
  },
  {
    question: "What is the size of inactive memory in bytes for a specific node and job?",
    query: "node_memory_Inactive_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of active memory in bytes for a specific node and job?",
    query: "node_memory_Active_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of committed memory in bytes for a specific node and job?",
    query: "node_memory_Committed_AS_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the memory commit limit in bytes for a specific node and job?",
    query: "node_memory_CommitLimit_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of inactive file memory in bytes for a specific node and job?",
    query: "node_memory_Inactive_file_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of inactive anonymous memory in bytes for a specific node and job?",
    query: "node_memory_Inactive_anon_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of active file memory in bytes for a specific node and job?",
    query: "node_memory_Active_file_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of active anonymous memory in bytes for a specific node and job?",
    query: "node_memory_Active_anon_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of active file memory in bytes for a specific node and job?",
    query: "node_memory_Active_file_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of active anonymous memory in bytes for a specific node and job?",
    query: "node_memory_Active_anon_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is currently being written back in bytes for a specific node and job?",
    query: "node_memory_Writeback_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the temporary writeback memory in bytes for a specific node and job?",
    query: "node_memory_WritebackTmp_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is marked as dirty in bytes for a specific node and job?",
    query: "node_memory_Dirty_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of mapped memory in bytes for a specific node and job?",
    query: "node_memory_Mapped_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of shared memory (Shmem) in bytes for a specific node and job?",
    query: "node_memory_Shmem_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is allocated for shared huge pages (ShmemHugePages) in bytes for a specific node and job?",
    query: "node_memory_ShmemHugePages_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of shared memory that is mapped with PMD (ShmemPmdMapped) in bytes for a specific node and job?",
    query: "node_memory_ShmemPmdMapped_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is unreclaimable by the system (SUnreclaim) in bytes for a specific node and job?",
    query: "node_memory_SUnreclaim_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of reclaimable slab memory (SReclaimable) in bytes for a specific node and job?",
    query: "node_memory_SReclaimable_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is available as a chunk in the vmalloc area (VmallocChunk) in bytes for a specific node and job?",
    query: "node_memory_VmallocChunk_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total size of the vmalloc area (VmallocTotal) in bytes for a specific node and job?",
    query: "node_memory_VmallocTotal_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is used in the vmalloc area (VmallocUsed) in bytes for a specific node and job?",
    query: "node_memory_VmallocUsed_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of memory used for bounce buffers in bytes for a specific node and job?",
    query: "node_memory_Bounce_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is used for anonymous huge pages (AnonHugePages) in bytes for a specific node and job?",
    query: "node_memory_AnonHugePages_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of memory used for anonymous pages (AnonPages) in bytes for a specific node and job?",
    query: "node_memory_AnonPages_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is used for the kernel stack in bytes for a specific node and job?",
    query: "node_memory_KernelStack_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of per-CPU memory in bytes for a specific node and job?",
    query: "node_memory_Percpu_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many huge pages are currently free for a specific node and job?",
    query: "node_memory_HugePages_Free{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many huge pages are reserved for a specific node and job?",
    query: "node_memory_HugePages_Rsvd{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many surplus huge pages are available for a specific node and job?",
    query: "node_memory_HugePages_Surp{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total number of huge pages for a specific node and job?",
    query: "node_memory_HugePages_Total{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the size of each huge page in bytes for a specific node and job?",
    query: "node_memory_Hugepagesize_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is directly mapped as 1G pages in bytes for a specific node and job?",
    query: "node_memory_DirectMap1G_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is directly mapped as 2M pages in bytes for a specific node and job?",
    query: "node_memory_DirectMap2M_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is directly mapped as 4k pages in bytes for a specific node and job?",
    query: "node_memory_DirectMap4k_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the total amount of unevictable memory in bytes for a specific node and job?",
    query: "node_memory_Unevictable_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How much memory is locked (mlocked) in bytes for a specific node and job?",
    query: "node_memory_Mlocked_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the current number of unstable NFS memory bytes on a specific node?",
    query: "node_memory_NFS_Unstable_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of memory pages read into memory on a specific node?",
    query: "irate(node_vmstat_pgpgin{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of memory pages written out of memory on a specific node?",
    query: "irate(node_vmstat_pgpgout{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of swap pages read into memory on a specific node?",
    query: "irate(node_vmstat_pswpin{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of swap pages written out of memory on a specific node?",
    query: "irate(node_vmstat_pswpout{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of minor page faults on a specific node?",
    query: "irate(node_vmstat_pgfault{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of major page faults on a specific node?",
    query: "irate(node_vmstat_pgmajfault{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of minor page faults minus major page faults on a specific node?",
    query: "irate(node_vmstat_pgfault{{instance=\"$node\",job=\"$job\"}}[5m]) - irate(node_vmstat_pgmajfault{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of out-of-memory kills on a specific node?",
    query: "irate(node_vmstat_oom_kill{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the estimated clock error in seconds on a specific node?",
    query: "node_timex_estimated_error_seconds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the clock offset in seconds on a specific node?",
    query: "node_timex_offset_seconds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the maximum error in seconds for the clock on a specific node?",
    query: "node_timex_maxerror_seconds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the loop time constant for the clock on a specific node?",
    query: "node_timex_loop_time_constant{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the synchronization status of the clock on a specific node?",
    query: "node_timex_sync_status{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the frequency adjustment ratio for the clock on a specific node?",
    query: "node_timex_frequency_adjustment_ratio{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the tick duration in seconds for the clock on a specific node?",
    query: "node_timex_tick_seconds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the TAI offset in seconds for the clock on a specific node?",
    query: "node_timex_tai_offset_seconds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many processes are currently blocked on a specific node?",
    query: "node_procs_blocked{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many processes are currently running on a specific node?",
    query: "node_procs_running{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the current state of all processes on a specific node?",
    query: "node_processes_state{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of forks on a specific node?",
    query: "irate(node_forks_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of virtual memory usage on a specific node?",
    query: "irate(process_virtual_memory_bytes{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the maximum resident memory usage on a specific node?",
    query: "process_resident_memory_max_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of maximum virtual memory usage on a specific node?",
    query: "irate(process_virtual_memory_max_bytes{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the current number of PIDs on a specific node?",
    query: "node_processes_pids{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the maximum number of processes allowed on a specific node?",
    query: "node_processes_max_processes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of CPU running time on a specific node?",
    query: "irate(node_schedstat_running_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of CPU waiting time on a specific node?",
    query: "irate(node_schedstat_waiting_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the current number of threads on a specific node?",
    query: "node_processes_threads{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the maximum number of threads used by processes on the node?",
    query: "node_processes_max_threads{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of context switches on the node?",
    query: "irate(node_context_switches_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of interrupts on the node?",
    query: "irate(node_intr_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the 1-minute load average on the node?",
    query: "node_load1{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the 5-minute load average on the node?",
    query: "node_load5{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the 15-minute load average on the node?",
    query: "node_load15{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the current CPU frequency in hertz on the node?",
    query: "node_cpu_scaling_frequency_hertz{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the average maximum CPU frequency in hertz on the node?",
    query: "avg(node_cpu_scaling_frequency_max_hertz{{instance=\"$node\",job=\"$job\"}})"
  },
  {
    question: "What is the average minimum CPU frequency in hertz on the node?",
    query: "avg(node_cpu_scaling_frequency_min_hertz{{instance=\"$node\",job=\"$job\"}})"
  },
  {
    question: "What is the rate of CPU waiting pressure on the node?",
    query: "rate(node_pressure_cpu_waiting_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of memory waiting pressure on the node?",
    query: "rate(node_pressure_memory_waiting_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of memory stalled pressure on the node?",
    query: "rate(node_pressure_memory_stalled_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of IO waiting pressure on the node?",
    query: "rate(node_pressure_io_waiting_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of IO stalled pressure on the node?",
    query: "rate(node_pressure_io_stalled_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of interrupts on the node?",
    query: "irate(node_interrupts_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of scheduler timeslices on the node?",
    query: "irate(node_schedstat_timeslices_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the available entropy in bits on the node?",
    query: "node_entropy_available_bits{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of CPU seconds consumed by processes on the node?",
    query: "irate(process_cpu_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the maximum number of file descriptors for a process on the node?",
    query: "process_max_fds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the current number of open file descriptors for a process on the node?",
    query: "process_open_fds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the temperature of hardware monitored chips on the node?",
    query: "node_hwmon_temp_celsius{{instance=\"$node\",job=\"$job\"}} * on(chip) group_left(chip_name) node_hwmon_chip_names{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the critical alarm temperature of hardware monitored chips on the node?",
    query: "node_hwmon_temp_crit_alarm_celsius{{instance=\"$node\",job=\"$job\"}} * on(chip) group_left(chip_name) node_hwmon_chip_names{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the critical temperature of hardware monitored chips on the node?",
    query: "node_hwmon_temp_crit_celsius{{instance=\"$node\",job=\"$job\"}} * on(chip) group_left(chip_name) node_hwmon_chip_names{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the critical hysteresis temperature of hardware monitored chips on the node?",
    query: "node_hwmon_temp_crit_hyst_celsius{{instance=\"$node\",job=\"$job\"}} * on(chip) group_left(chip_name) node_hwmon_chip_names{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the maximum temperature of hardware monitored chips on the node?",
    query: "node_hwmon_temp_max_celsius{{instance=\"$node\",job=\"$job\"}} * on(chip) group_left(chip_name) node_hwmon_chip_names{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the current state of cooling devices on the node?",
    query: "node_cooling_device_cur_state{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the maximum state of cooling devices on the node?",
    query: "node_cooling_device_max_state{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "Is the power supply online for the node?",
    query: "node_power_supply_online{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of accepted connections by systemd sockets on the node?",
    query: "irate(node_systemd_socket_accepted_connections_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the number of systemd units in an activating state on the node?",
    query: "node_systemd_units{{instance=\"$node\",job=\"$job\",state=\"activating\"}}"
  },
  {
    question: "How many systemd units are currently active on the specified node and job?",
    query: "node_systemd_units{{instance=\"$node\",job=\"$job\",state=\"active\"}}"
  },
  {
    question: "How many systemd units are deactivating on the specified node and job?",
    query: "node_systemd_units{{instance=\"$node\",job=\"$job\",state=\"deactivating\"}}"
  },
  {
    question: "How many systemd units have failed on the specified node and job?",
    query: "node_systemd_units{{instance=\"$node\",job=\"$job\",state=\"failed\"}}"
  },
  {
    question: "How many systemd units are inactive on the specified node and job?",
    query: "node_systemd_units{{instance=\"$node\",job=\"$job\",state=\"inactive\"}}"
  },
  {
    question: "What is the rate of completed disk read operations on the specified node and job?",
    query: "irate(node_disk_reads_completed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of completed disk write operations on the specified node and job?",
    query: "irate(node_disk_writes_completed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of bytes read from disk on the specified node and job?",
    query: "irate(node_disk_read_bytes_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of bytes written to disk on the specified node and job?",
    query: "irate(node_disk_written_bytes_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the average time spent reading from disk per operation on the specified node and job?",
    query: "irate(node_disk_read_time_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m]) / irate(node_disk_reads_completed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the average time spent writing to disk per operation on the specified node and job?",
    query: "irate(node_disk_write_time_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m]) / irate(node_disk_writes_completed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of weighted I/O time on the specified node and job?",
    query: "irate(node_disk_io_time_weighted_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of merged disk reads on the specified node and job?",
    query: "irate(node_disk_reads_merged_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of merged disk writes on the specified node and job?",
    query: "irate(node_disk_writes_merged_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of I/O time on the specified node and job?",
    query: "irate(node_disk_io_time_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of discarded I/O time on the specified node and job?",
    query: "irate(node_disk_discard_time_seconds_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "How many I/O operations are currently being processed on the specified node and job?",
    query: "node_disk_io_now{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of completed discard operations on the specified node and job?",
    query: "irate(node_disk_discards_completed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of merged discard operations on the specified node and job?",
    query: "irate(node_disk_discards_merged_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "How many bytes are available in the filesystem on the specified node and job (excluding rootfs)?",
    query: "node_filesystem_avail_bytes{{instance=\"$node\",job=\"$job\",device!~'rootfs'}}"
  },
  {
    question: "How many bytes are free in the filesystem on the specified node and job (excluding rootfs)?",
    query: "node_filesystem_free_bytes{{instance=\"$node\",job=\"$job\",device!~'rootfs'}}"
  },
  {
    question: "What is the total size of the filesystem on the specified node and job (excluding rootfs)?",
    query: "node_filesystem_size_bytes{{instance=\"$node\",job=\"$job\",device!~'rootfs'}}"
  },
  {
    question: "How many free files are available in the filesystem on the specified node and job (excluding rootfs)?",
    query: "node_filesystem_files_free{{instance=\"$node\",job=\"$job\",device!~'rootfs'}}"
  },
  {
    question: "What is the maximum number of file descriptors on the specified node and job?",
    query: "node_filefd_maximum{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many file descriptors are currently allocated on the specified node and job?",
    query: "node_filefd_allocated{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many files are available on the filesystem for a specific node and job?",
    query: "node_filesystem_files{{instance=\"$node\",job=\"$job\",device!~'rootfs'}}"
  },
  {
    question: "Is the filesystem read-only for a specific node and job?",
    query: "node_filesystem_readonly{{instance=\"$node\",job=\"$job\",device!~'rootfs'}}"
  },
  {
    question: "Are there any device errors on the filesystem for a specific node and job?",
    query: "node_filesystem_device_error{{instance=\"$node\",job=\"$job\",device!~'rootfs',fstype!~'tmpfs'}}"
  },
  {
    question: "What is the rate of packets received on the network interface for a specific node and job?",
    query: "irate(node_network_receive_packets_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of packets transmitted on the network interface for a specific node and job?",
    query: "irate(node_network_transmit_packets_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of network receive errors for a specific node and job?",
    query: "irate(node_network_receive_errs_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of network transmit errors for a specific node and job?",
    query: "irate(node_network_transmit_errs_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of dropped packets on receive for a specific node and job?",
    query: "irate(node_network_receive_drop_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of dropped packets on transmit for a specific node and job?",
    query: "irate(node_network_transmit_drop_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of compressed packets received on the network for a specific node and job?",
    query: "irate(node_network_receive_compressed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of compressed packets transmitted on the network for a specific node and job?",
    query: "irate(node_network_transmit_compressed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of multicast packets received on the network for a specific node and job?",
    query: "irate(node_network_receive_multicast_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of FIFO errors on receive for a specific node and job?",
    query: "irate(node_network_receive_fifo_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of FIFO errors on transmit for a specific node and job?",
    query: "irate(node_network_transmit_fifo_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of frame errors on receive for a specific node and job?",
    query: "irate(node_network_receive_frame_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of carrier errors on transmit for a specific node and job?",
    query: "irate(node_network_transmit_carrier_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of collisions on transmit for a specific node and job?",
    query: "irate(node_network_transmit_colls_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "How many active network connections are being tracked for a specific node and job?",
    query: "node_nf_conntrack_entries{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the maximum number of network connections that can be tracked for a specific node and job?",
    query: "node_nf_conntrack_entries_limit{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many ARP entries are currently active for a specific node and job?",
    query: "node_arp_entries{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the MTU size of the network interface for a specific node and job?",
    query: "node_network_mtu_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the network speed in bytes for a specific node and job?",
    query: "node_network_speed_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the transmit queue length for the network interface of a specific node and job?",
    query: "node_network_transmit_queue_length{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of processed soft network interrupts on a specific node?",
    query: "irate(node_softnet_processed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of dropped soft network interrupts on a specific node?",
    query: "irate(node_softnet_dropped_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "How often is the softnet buffer squeezed on a specific node?",
    query: "irate(node_softnet_times_squeezed_total{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "Is the network interface up on a specific node?",
    query: "node_network_up{{operstate=\"up\",instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the carrier state of the network interface on a specific node?",
    query: "node_network_carrier{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many TCP sockets are allocated on a specific node?",
    query: "node_sockstat_TCP_alloc{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many TCP sockets are currently in use on a specific node?",
    query: "node_sockstat_TCP_inuse{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the memory usage of TCP sockets on a specific node?",
    query: "node_sockstat_TCP_mem{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many orphaned TCP sockets are on a specific node?",
    query: "node_sockstat_TCP_orphan{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many TCP sockets are in TIME-WAIT state on a specific node?",
    query: "node_sockstat_TCP_tw{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many UDPLITE sockets are in use on a specific node?",
    query: "node_sockstat_UDPLITE_inuse{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many UDP sockets are in use on a specific node?",
    query: "node_sockstat_UDP_inuse{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the memory usage of UDP sockets on a specific node?",
    query: "node_sockstat_UDP_mem{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many fragmented packets are in use on a specific node?",
    query: "node_sockstat_FRAG_inuse{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many raw sockets are in use on a specific node?",
    query: "node_sockstat_RAW_inuse{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the memory usage of TCP sockets in bytes on a specific node?",
    query: "node_sockstat_TCP_mem_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the memory usage of UDP sockets in bytes on a specific node?",
    query: "node_sockstat_UDP_mem_bytes{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the memory usage of fragmented packets on a specific node?",
    query: "node_sockstat_FRAG_memory{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many sockets are currently in use on a specific node?",
    query: "node_sockstat_sockets_used{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of inbound octets on a specific node?",
    query: "irate(node_netstat_IpExt_InOctets{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of outbound octets on a specific node?",
    query: "irate(node_netstat_IpExt_OutOctets{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of IP packet forwarding on a specific node?",
    query: "irate(node_netstat_Ip_Forwarding{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of ICMP messages received on a specific node?",
    query: "irate(node_netstat_Icmp_InMsgs{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of outgoing ICMP messages on a specific node?",
    query: "irate(node_netstat_Icmp_OutMsgs{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of incoming ICMP errors on a specific node?",
    query: "irate(node_netstat_Icmp_InErrors{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of incoming UDP datagrams on a specific node?",
    query: "irate(node_netstat_Udp_InDatagrams{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of outgoing UDP datagrams on a specific node?",
    query: "irate(node_netstat_Udp_OutDatagrams{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of UDP input errors on a specific node?",
    query: "irate(node_netstat_Udp_InErrors{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of UDP packets dropped due to no available ports on a specific node?",
    query: "irate(node_netstat_Udp_NoPorts{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of UDP-Lite input errors on a specific node?",
    query: "irate(node_netstat_UdpLite_InErrors{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of UDP receive buffer errors on a specific node?",
    query: "irate(node_netstat_Udp_RcvbufErrors{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of UDP send buffer errors on a specific node?",
    query: "irate(node_netstat_Udp_SndbufErrors{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of incoming TCP segments on a specific node?",
    query: "irate(node_netstat_Tcp_InSegs{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of outgoing TCP segments on a specific node?",
    query: "irate(node_netstat_Tcp_OutSegs{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of TCP listen overflows on a specific node?",
    query: "irate(node_netstat_TcpExt_ListenOverflows{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of TCP listen drops on a specific node?",
    query: "irate(node_netstat_TcpExt_ListenDrops{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of TCP SYN retransmissions on a specific node?",
    query: "irate(node_netstat_TcpExt_TCPSynRetrans{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of TCP retransmitted segments on a specific node?",
    query: "irate(node_netstat_Tcp_RetransSegs{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of TCP input errors on a specific node?",
    query: "irate(node_netstat_Tcp_InErrs{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of TCP outgoing resets on a specific node?",
    query: "irate(node_netstat_Tcp_OutRsts{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of TCP receive queue drops on a specific node?",
    query: "irate(node_netstat_TcpExt_TCPRcvQDrop{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of TCP out-of-order queue packets on a specific node?",
    query: "irate(node_netstat_TcpExt_TCPOFOQueue{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the current number of established TCP connections on a specific node?",
    query: "node_netstat_Tcp_CurrEstab{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the maximum number of TCP connections on a specific node?",
    query: "node_netstat_Tcp_MaxConn{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the rate of failed TCP SYN cookies on a specific node?",
    query: "irate(node_netstat_TcpExt_SyncookiesFailed{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of received TCP SYN cookies on a specific node?",
    query: "irate(node_netstat_TcpExt_SyncookiesRecv{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of sent TCP SYN cookies on a specific node?",
    query: "irate(node_netstat_TcpExt_SyncookiesSent{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of active TCP opens on a specific node?",
    query: "irate(node_netstat_Tcp_ActiveOpens{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "What is the rate of passive TCP opens on a specific node?",
    query: "irate(node_netstat_Tcp_PassiveOpens{{instance=\"$node\",job=\"$job\"}}[5m])"
  },
  {
    question: "How many TCP connections are in the 'established' state on a specific node?",
    query: "node_tcp_connection_states{{state=\"established\",instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many TCP connections are in the 'fin_wait2' state on a specific node?",
    query: "node_tcp_connection_states{{state=\"fin_wait2\",instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many TCP connections are in the 'listen' state on a specific node?",
    query: "node_tcp_connection_states{{state=\"listen\",instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "How many TCP connections are in the 'time_wait' state on a specific node?",
    query: "node_tcp_connection_states{{state=\"time_wait\",instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "What is the duration of the last scrape collector run on a specific node?",
    query: "node_scrape_collector_duration_seconds{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "Did the last scrape collector run succeed on a specific node?",
    query: "node_scrape_collector_success{{instance=\"$node\",job=\"$job\"}}"
  },
  {
    question: "Are there any errors in the textfile collector on a specific node?",
    query: "node_textfile_scrape_error{{instance=\"$node\",job=\"$job\"}}"
  }
];
