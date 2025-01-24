import shell from 'shelljs';
import * as dotenv from "dotenv";
dotenv.config();

const namespace = 'boutique';
const chartPath = 'demos/online-boutique';
const releaseName = 'online-boutique';

const CLUSTER_NAME = process.env.CLUSTER_NAME || "online-boutique-autopilot";
const REGION = process.env.REGION || "us-central1";

console.log(`Deploying using Helm on GKE Autopilot...`);

if (shell.exec(`gcloud container clusters get-credentials ${CLUSTER_NAME} --region ${REGION}`).code !== 0) {
    console.error("❌ Failed to get cluster credentials");
    process.exit(1);
}

if (shell.exec(`helm dependency build ${chartPath}`).code !== 0) {
    console.error("❌ Failed to build Helm chart dependencies");
    process.exit(1);
}

if (shell.exec(`helm upgrade --install ${releaseName} ${chartPath} -n ${namespace} --create-namespace`).code !== 0) {
    console.error("❌ Failed to deploy Helm chart");
    process.exit(1);
}

console.log("✅ GKE Helm deployment completed successfully!");