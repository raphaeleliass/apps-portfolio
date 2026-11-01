export type Project = {
  name: string;
  slug: string;
  description: string;
  repository: string;
  website: string | null;
  language: string | null;
  readme: string | null;
};

export function safeWebsite(value: unknown): string | null {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export function parseProjects(payload: unknown): Project[] {
  if (!payload || typeof payload !== "object")
    throw new Error("Invalid GitHub response");
  const result = payload as {
    errors?: unknown;
    data?: { user?: { pinnedItems?: { nodes?: unknown[] } } };
  };
  const nodes = result.data?.user?.pinnedItems?.nodes;
  if (result.errors || !Array.isArray(nodes))
    throw new Error("Invalid GitHub response");
  return nodes.flatMap((node) => {
    if (!node || typeof node !== "object") return [];
    const repo = node as Record<string, unknown>;
    if (repo.isPrivate !== false) return [];
    if (typeof repo.name !== "string" || !/^[a-zA-Z0-9_.-]+$/.test(repo.name))
      throw new Error("Invalid repository name");
    const repository = safeWebsite(repo.url);
    if (!repository || new URL(repository).hostname !== "github.com")
      throw new Error("Invalid repository URL");
    const language = repo.primaryLanguage as { name?: unknown } | null;
    const readme = repo.readme as { text?: unknown } | null;
    return [
      {
        name: repo.name,
        slug: repo.name,
        description:
          typeof repo.description === "string"
            ? repo.description
            : "Conheça o projeto no GitHub.",
        repository,
        website: safeWebsite(repo.homepageUrl),
        language: typeof language?.name === "string" ? language.name : null,
        readme: typeof readme?.text === "string" ? readme.text : null,
      },
    ];
  });
}
