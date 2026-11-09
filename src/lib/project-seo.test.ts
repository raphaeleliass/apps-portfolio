import { expect, test } from "bun:test";
import type { Project } from "./project-data";
import { projectSeo } from "./project-seo";
import {
  catalogStructuredData,
  pageMetadata,
  projectStructuredData,
} from "./site-metadata";

const project: Project = {
  name: "jornaleiro_bot",
  slug: "jornaleiro_bot",
  description: "Descrição do repositório.",
  repository: "https://github.com/raphaeleliass/jornaleiro_bot",
  website: null,
  language: "TypeScript",
  readme: null,
};

test("project search intent is consistent across metadata, social cards and structured data", () => {
  const seo = projectSeo(project);
  expect(seo.title).toBe("Jornaleiro Bot: notícias do dia no Telegram");
  expect(seo.description).toContain("Hono, Drizzle ORM e Bun");
  const metadata = pageMetadata(
    seo.title,
    seo.description,
    `/projetos/${project.slug}`,
  );
  const title = `${seo.title} | Raphael Elias`;
  expect(metadata.title).toEqual({ absolute: title });
  expect(metadata.description).toBe(seo.description);
  expect(metadata.openGraph).toMatchObject({
    title,
    description: seo.description,
  });
  expect(metadata.twitter).toMatchObject({
    title,
    description: seo.description,
  });
  expect(
    catalogStructuredData([project]).mainEntity.itemListElement[0].description,
  ).toBe(seo.description);
  expect(projectStructuredData(project)["@graph"][0]).toMatchObject({
    name: seo.title,
    description: seo.description,
  });
});

test("new projects and repositories from other owners retain their own GitHub content", () => {
  const other = {
    ...project,
    repository: "https://github.com/other/jornaleiro_bot",
  };
  expect(projectSeo(other)).toEqual({
    title: other.name,
    description: other.description,
  });
  expect(projectSeo({ ...other, description: " \n " }).description).toContain(
    other.name,
  );
});

test("all current project snippets are specific and fit a concise search preview", () => {
  const names = [
    "portfolio",
    "jornaleiro_bot",
    "linkasaur",
    "rapha_codes",
    "bside",
  ];
  const descriptions = new Set<string>();
  for (const name of names) {
    const seo = projectSeo({
      ...project,
      name,
      repository: `https://github.com/raphaeleliass/${name}`,
    });
    expect(`${seo.title} | Raphael Elias`.length).toBeLessThanOrEqual(65);
    expect(seo.description.length).toBeLessThanOrEqual(165);
    descriptions.add(seo.description);
  }
  expect(descriptions.size).toBe(names.length);
});
