import shell from 'shelljs';
import * as dotenv from "dotenv";
dotenv.config();

console.log(`Creating cluster on GKE Autopilot...`);

const PROJECT_ID = shell.exec(`gcloud config get-value project`).stdout.trim();
const CLUSTER_NAME = process.env.CLUSTER_NAME || "online-boutique-autopilot";
const REGION = process.env.REGION || "us-central1";
const DEMO_EMAIL = process.env.DEMO_EMAIL || "test@test.com";



// Step 1: Set Google Cloud project
if (shell.exec(`gcloud config set project ${PROJECT_ID}`).code !== 0) {
    console.error("❌ Failed to set project");
    process.exit(1);
}

// Step 2: Enable required GKE API (only needed if not already enabled)
if (shell.exec(`gcloud services enable container.googleapis.com`).code !== 0) {
    console.error("❌ Failed to enable GKE API");
    process.exit(1);
}

// Step 3: Create GKE Autopilot Cluster (Much simpler than standard GKE)
if (shell.exec(`gcloud container clusters create-auto ${CLUSTER_NAME} --region ${REGION} --enable-managed-prometheus`).code !== 0) {
    console.error("❌ Failed to create GKE Autopilot cluster");
    process.exit(1);
}

// Step 4: Get Cluster Credentials
if (shell.exec(`gcloud container clusters get-credentials ${CLUSTER_NAME} --region ${REGION}`).code !== 0) {
    console.error("❌ Failed to get cluster credentials");
    process.exit(1);
}

// Step 5: Add IAM
if (shell.exec(`
    gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member=user:${DEMO_EMAIL} \
    --role=roles/container.admin
    `).code !== 0) {
    console.error("❌ Failed to set IAM");
    process.exit(1);
}


console.log("✅ GKE Autopilot cluster created successfully!");