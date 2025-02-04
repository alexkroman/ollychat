import shell from "shelljs";
import { config } from "../../src/config/demoConfig.js";

const releaseName = "grafana";

console.log(`Deploying ${releaseName} using Helm on GKE Autopilot...`);

// Get cluster credentials
if (
  shell.exec(
    `gcloud container clusters get-credentials ${config.clusterName} --region ${config.region}`,
  ).code !== 0
) {
  console.error("❌ Failed to get cluster credentials");
  process.exit(1);
}

// Add the Grafana Helm chart repository
if (
  shell.exec(`helm repo add grafana https://grafana.github.io/helm-charts`)
    .code !== 0
) {
  console.error("❌ Failed to add Grafana Helm repo");
  process.exit(1);
}

// Update Helm repositories
if (shell.exec(`helm repo update`).code !== 0) {
  console.error("❌ Failed to update Helm repos");
  process.exit(1);
}

// Deploy/upgrade Grafana
if (
  shell.exec(
    `helm upgrade --install ${releaseName} grafana/grafana --namespace monitoring --create-namespace`,
  ).code !== 0
) {
  console.error("❌ Failed to deploy Grafana Helm chart");
  process.exit(1);
}

console.log("✅ GKE Helm deployment (Grafana) completed successfully!");
