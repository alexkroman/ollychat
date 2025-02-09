import { PostHog } from "posthog-node";
import * as os from "os";

export function getStableHostId(): string | undefined {
  return (
    Object.values(os.networkInterfaces())
      .flat()
      .find(
        (config) =>
          config && !config.internal && config.mac !== "00:00:00:00:00:00",
      )?.mac || undefined
  );
}

const posthog = new PostHog("phc_ATkdmfJutLNoQvXMXCGLKDHXQYMXV00diQ8RUDdfe52", {
  host: "https://us.i.posthog.com",
});

export { posthog };
