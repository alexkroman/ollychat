export function extractPromQLMetrics(query: string): string[] {
  const metricRegex = /[a-zA-Z_:][a-zA-Z0-9_:]*/g;
  const promQLFunctions = new Set([
      "sum", "avg", "min", "max", "count", "rate", "irate", "delta", "increase", "topk", "bottomk",
      "quantile", "sort", "sort_desc", "sort_asc", "stddev", "stdvar", "abs", "clamp_max", "clamp_min",
      "by", "m", "oninstance", "job", "__range", "count_over_time", "sum_over_time", "avg_over_time","__interval",
      "or", "histogram_quantile", "label_replace", "label_join", "receiver", "instance", "job", "namespace","exporter",
      "grouping", "le","exp","service_name","title","name","pod","s","method","path","h","type","level","location",
      "and","realm","kind","ref","unless","node","code","interval","requestKind","controller","d","on","group_left","interval",
      "time","changes","d:1d","d:1h","d:1m","d:1s","d:1w","d:1y","d:2d","d:2h","d:2m","d:2s","d:2w","d:2y","d:3d","d:3h",
      "Identifier","OR","info","proto","type","zone","service","container_name","pod_name","pod_namespace","pod_uid",
      "interval","mount","vector","time","volume","project","version","task_execution_id","task_name","cluster","predict_linear",
      "status", "gpu","Interval","datname","i","searchable_pattern","job_name","query","verb","policy_name","stream",
      "flag","value","round","status","verb","BY","idle","mode"
  ]);

  const metrics = new Set<string>();
  const matches = query.match(metricRegex);
  if (matches) {
      matches.forEach(metric => {
          if (!promQLFunctions.has(metric) && !metric.includes("(")) {
              metrics.add(metric);
          }
      });
  }
  return Array.from(metrics).sort();
}