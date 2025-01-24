import { PostHog } from "posthog-node";
import * as os from "os";

function getStableHostId(): string {
  const macAddress = Object.values(os.networkInterfaces())
    .flat()
    .find(
      (config) =>
        config &&
        !config.internal &&
        config.mac &&
        config.mac !== "00:00:00:00:00:00",
    )?.mac;
  return macAddress || "unknown";
}

export const hostId = getStableHostId();

export const posthog = new PostHog(
  "phc_ATkdmfJutLNoQvXMXCGLKDHXQYMXV00diQ8RUDdfe52",
  {
    host: "https://us.i.posthog.com",
  },
);
