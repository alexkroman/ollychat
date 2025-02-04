import shell from "shelljs";
import { config } from "../../src/config/demoConfig.js";

const releaseName = "prometheus-external";
const chartPath = "demos/prometheus-external";

console.log(`Deploying ${releaseName} using Helm on GKE Autopilot...`);

if (
  shell.exec(
    `gcloud container clusters get-credentials ${config.clusterName} --region ${config.region}`,
  ).code !== 0
) {
  console.error("❌ Failed to get cluster credentials");
  process.exit(1);
}

if (
  shell.exec(
    `helm upgrade --install ${releaseName} ${chartPath} --namespace monitoring --create-namespace`,
  ).code !== 0
) {
  console.error("❌ Failed to deploy Helm chart");
  process.exit(1);
}

console.log("✅ GKE Helm deployment completed successfully!");
