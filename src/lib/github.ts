import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { type Project, parseProjects } from "./project-data";

type Catalog = {
  projects: Project[];
  status: "ready" | "stale" | "unconfigured" | "unavailable";
};
type Snapshot = { savedAt: number; projects: Project[] };
const query = `query Projects($login: String!) {
  user(login: $login) { pinnedItems(first: 6, types: REPOSITORY) { nodes {
    ... on Repository { name description url homepageUrl isPrivate primaryLanguage { name }
      readme: object(expression: "HEAD:README.md") { ... on Blob { text } }
    }
  } } }
}`;

export const getCatalog = cache(async (): Promise<Catalog> => {
  const { env } = await getCloudflareContext({ async: true });
  const config = env as unknown as {
    GITHUB_TOKEN?: string;
    GITHUB_USERNAME?: string;
  };
  const token = config.GITHUB_TOKEN;
  if (!token) return { projects: [], status: "unconfigured" };
  const login = config.GITHUB_USERNAME || "raphaeleliass";
  const key = new Request(
    `https://apps.raphaelelias.dev/__catalog/${encodeURIComponent(login)}`,
  );
  // shortcut: cache regional do Workers, adotar armazenamento compartilhado se o tráfego exigir.
  const store = (globalThis as unknown as { caches?: { default?: Cache } })
    .caches?.default;
  let snapshot: Snapshot | undefined;
  try {
    const response = await store?.match(key);
    if (response) snapshot = (await response.json()) as Snapshot;
  } catch {
    /* Cache failure must not prevent a fresh GitHub request. */
  }
  if (snapshot && Date.now() - snapshot.savedAt < 900_000)
    return { projects: snapshot.projects, status: "ready" };
  try {
    const latest = await unstable_cache(
      async (): Promise<Snapshot> => {
        const response = await fetch("https://api.github.com/graphql", {
          method: "POST",
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "raphael-apps-portfolio",
          },
          body: JSON.stringify({ query, variables: { login } }),
        });
        if (!response.ok) throw new Error("GitHub request failed");
        return {
          projects: parseProjects(await response.json()),
          savedAt: Date.now(),
        };
      },
      ["github-catalog-v1", login],
      { revalidate: 900 },
    )();
    const age = Date.now() - latest.savedAt;
    if (age >= 86_400_000) throw new Error("Cached catalog expired");
    const saved = Response.json(latest, {
      headers: { "Cache-Control": "max-age=86400" },
    });
    try {
      await store?.put(key, saved);
    } catch {
      /* A successful catalog remains usable if caching fails. */
    }
    return {
      projects: latest.projects,
      status: age < 900_000 ? "ready" : "stale",
    };
  } catch {
    if (snapshot && Date.now() - snapshot.savedAt < 86_400_000)
      return { projects: snapshot.projects, status: "stale" };
    return { projects: [], status: "unavailable" };
  }
});
