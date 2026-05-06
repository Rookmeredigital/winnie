import { defineCloudflareConfig } from '@opennextjs/cloudflare';

export default defineCloudflareConfig({
  // No incremental cache, no on-demand revalidation, no R2 yet —
  // Winnie is dynamic-only and tiny. We'll layer caching in later
  // phases if a real workload appears.
});
