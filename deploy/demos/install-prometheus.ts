import shell from "shelljs";
import { config } from "../../src/config/demoConfig.js";

const releaseName = "prometheus";

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
    `helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`,
  ).code !== 0
) {
  console.error("❌ Failed to add Helm repo");
  process.exit(1);
}

if (shell.exec(`helm repo update`).code !== 0) {
  console.error("❌ Failed to update Helm repo");
  process.exit(1);
}

if (
  shell.exec(
    `helm upgrade --install ${releaseName} prometheus-community/prometheus --namespace monitoring --create-namespace`,
  ).code !== 0
) {
  console.error("❌ Failed to deploy Helm chart");
  process.exit(1);
}

console.log("✅ GKE Helm deployment completed successfully!");
