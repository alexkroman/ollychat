import shell from 'shelljs';
import * as dotenv from "dotenv";
dotenv.config();

const releaseName = 'prometheus';
const CLUSTER_NAME = process.env.CLUSTER_NAME || "online-boutique-autopilot";
const REGION = process.env.REGION || "us-central1";

console.log(`Deploying ${releaseName} using Helm on GKE Autopilot...`);

if (shell.exec(`gcloud container clusters get-credentials ${CLUSTER_NAME} --region ${REGION}`).code !== 0) {
    console.error("❌ Failed to get cluster credentials");
    process.exit(1);
}

if (shell.exec(`helm repo add prometheus-community https://prometheus-community.github.io/helm-charts`).code !== 0) {
    console.error("❌ Failed to add Helm repo");
    process.exit(1);
}

if (shell.exec(`helm repo update`).code !== 0) {
    console.error("❌ Failed to update Helm repo");
    process.exit(1);
}

if (shell.exec(`helm upgrade --install ${releaseName} prometheus-community/prometheus --namespace monitoring --create-namespace`).code !== 0) {
    console.error("❌ Failed to deploy Helm chart");
    process.exit(1);
}

console.log("✅ GKE Helm deployment completed successfully!");

