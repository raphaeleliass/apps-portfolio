import type { Metadata } from "next";
import type { Project } from "./project-data";
import { projectSeo } from "./project-seo";

export const siteUrl = "https://apps.raphaelelias.dev";
export const siteName = "Apps de Raphael Elias";
export const siteTitle = "Aplicativos e projetos de software | Raphael Elias";
export const siteDescription =
  "Explore os aplicativos e projetos de Raphael Elias. Acesse as aplicações, conheça as tecnologias e consulte o código e a documentação no GitHub.";

export function catalogStructuredData(projects: Project[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/#catalog`,
    url: `${siteUrl}/`,
    name: siteTitle,
    description: siteDescription,
    inLanguage: "pt-BR",
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: project.name,
        description: projectSeo(project).description,
        url: `${siteUrl}/projetos/${encodeURIComponent(project.slug)}`,
      })),
    },
  };
}

export function projectStructuredData(project: Project) {
  const url = `${siteUrl}/projetos/${encodeURIComponent(project.slug)}`;
  const { title, description } = projectSeo(project);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: title,
        description,
        inLanguage: "pt-BR",
        isPartOf: { "@id": `${siteUrl}/#website` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: {
          "@type": "SoftwareSourceCode",
          name: project.name,
          description,
          codeRepository: project.repository,
          ...(project.website ? { url: project.website } : {}),
          ...(project.language
            ? { programmingLanguage: project.language }
            : {}),
          author: { "@id": "https://raphaelelias.dev/#person" },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Todos os projetos",
            item: `${siteUrl}/`,
          },
          { "@type": "ListItem", position: 2, name: project.name, item: url },
        ],
      },
    ],
  };
}

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = new URL(path, siteUrl).href;
  const pageTitle = path === "/" ? siteTitle : `${title} | Raphael Elias`;
  const images = [
    {
      url: `${siteUrl}/social-preview.png`,
      width: 1200,
      height: 630,
      alt: "Apps em destaque — uma seleção do que Raphael Elias constrói.",
    },
  ];
  return {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName,
      title: pageTitle,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images,
    },
  };
}
