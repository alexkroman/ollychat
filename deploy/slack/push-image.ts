import shell from "shelljs";
import { config } from "../../src/config/demoConfig.js";

if (shell.exec(`npm run docker:build`).code !== 0) {
  console.error("❌ Failed to build container");
  process.exit(1);
}

if (shell.exec(`gcloud auth configure-docker`).code !== 0) {
  console.error("❌ Failed to configure docker");
  process.exit(1);
}

if (shell.exec(`docker push gcr.io/my-project/ollychat:v1`).code !== 0) {
  console.error("❌ Failed to push image");
  process.exit(1);
}

console.log("✅ Slack deployment completed successfully!");
