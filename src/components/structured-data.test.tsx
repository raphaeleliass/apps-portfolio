import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import type { Project } from "../lib/project-data";
import {
  catalogStructuredData,
  projectStructuredData,
  siteUrl,
} from "../lib/site-metadata";
import { StructuredData } from "./structured-data";

const project: Project = {
  name: "escala",
  slug: "escala",
  description: "Gestão de escalas.",
  repository: "https://github.com/raphaeleliass/escala",
  website: "https://escala.example.com/",
  language: "TypeScript",
  readme: null,
};

test("catalog lists canonical project URLs in displayed order, including an empty catalog", () => {
  const data = catalogStructuredData([project]);
  expect(data.mainEntity.numberOfItems).toBe(1);
  expect(data.mainEntity.itemListElement[0]).toMatchObject({
    position: 1,
    name: project.name,
    description: project.description,
    url: `${siteUrl}/projetos/escala`,
  });
  expect(catalogStructuredData([]).mainEntity.itemListElement).toEqual([]);
});

test("project schema connects repository, author and canonical breadcrumbs without inventing missing information", () => {
  const data = projectStructuredData(project);
  expect(data["@graph"][0]).toMatchObject({
    mainEntity: {
      codeRepository: project.repository,
      programmingLanguage: "TypeScript",
      url: project.website,
      author: { "@id": "https://raphaelelias.dev/#person" },
    },
  });
  expect(data["@graph"][1].itemListElement).toMatchObject([
    { position: 1, item: `${siteUrl}/` },
    { position: 2, item: `${siteUrl}/projetos/escala` },
  ]);
  const minimal = projectStructuredData({
    ...project,
    language: null,
    website: null,
  });
  expect(minimal["@graph"][0].mainEntity).not.toHaveProperty(
    "programmingLanguage",
  );
  expect(minimal["@graph"][0].mainEntity).not.toHaveProperty("url");
});

test("untrusted GitHub descriptions cannot break out of the JSON-LD script", () => {
  const description = '</script><script>alert("xss")</script>';
  const data = catalogStructuredData([{ ...project, description }]);
  const html = renderToStaticMarkup(<StructuredData data={data} />);
  expect(html.match(/<script/g)).toHaveLength(1);
  const json = html.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
  expect(json).not.toContain("<");
  expect(JSON.parse(json)).toEqual(data);
});
