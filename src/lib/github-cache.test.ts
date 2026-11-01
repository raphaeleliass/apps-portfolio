import { afterEach, beforeEach, expect, mock, spyOn, test } from "bun:test";

const env: { GITHUB_TOKEN?: string; GITHUB_USERNAME: string } = {
  GITHUB_TOKEN: "test-token",
  GITHUB_USERNAME: "example",
};
const nextEntries = new Map<string, unknown>();
const cacheOptions: unknown[] = [];
mock.module("server-only", () => ({}));
mock.module("@opennextjs/cloudflare", () => ({
  getCloudflareContext: async () => ({ env }),
}));
mock.module("next/cache", () => ({
  unstable_cache:
    (callback: () => Promise<unknown>, keys: string[], options: unknown) =>
    async () => {
      cacheOptions.push(options);
      const key = keys.join(":");
      if (nextEntries.has(key)) return nextEntries.get(key);
      const result = await callback();
      nextEntries.set(key, result);
      return result;
    },
}));
const { getCatalog } = await import("./github");
const payload = {
  data: {
    user: {
      pinnedItems: {
        nodes: [
          {
            name: "demo",
            url: "https://github.com/example/demo",
            isPrivate: false,
            description: "Demo",
            readme: { text: "# Demo" },
          },
        ],
      },
    },
  },
};
let request: ReturnType<typeof spyOn>;

beforeEach(() => {
  nextEntries.clear();
  cacheOptions.length = 0;
  request = spyOn(globalThis, "fetch").mockResolvedValue(
    Response.json(payload),
  );
});
afterEach(() => {
  request.mockRestore();
});

test("separate catalog reads reuse the Next cache with a 15-minute revalidation", async () => {
  expect((await getCatalog()).status).toBe("ready");
  expect((await getCatalog()).projects[0].name).toBe("demo");
  expect(request).toHaveBeenCalledTimes(1);
  expect(cacheOptions).toEqual([{ revalidate: 900 }, { revalidate: 900 }]);
  expect([...nextEntries.keys()]).toEqual(["github-catalog-v1:example"]);
  expect(JSON.stringify([...nextEntries.values()])).not.toContain("test-token");
});

test("invalid GitHub responses are retried rather than cached", async () => {
  request.mockResolvedValue(
    Response.json({ errors: [{ message: "Unavailable" }] }),
  );
  expect((await getCatalog()).status).toBe("unavailable");
  expect((await getCatalog()).status).toBe("unavailable");
  expect(request).toHaveBeenCalledTimes(2);
  expect(nextEntries.size).toBe(0);
});

test("stale Next data remains marked stale and cannot outlive 24 hours", async () => {
  const key = "github-catalog-v1:example";
  nextEntries.set(key, { projects: [], savedAt: Date.now() - 901_000 });
  expect((await getCatalog()).status).toBe("stale");
  nextEntries.set(key, { projects: [], savedAt: Date.now() - 86_400_001 });
  expect((await getCatalog()).status).toBe("unavailable");
  expect(request).not.toHaveBeenCalled();
});
