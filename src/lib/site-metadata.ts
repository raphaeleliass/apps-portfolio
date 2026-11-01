import type { Metadata } from "next";

export const siteUrl = "https://apps.raphaelelias.dev";
export const siteTitle = "Raphael Elias - Apps";
export const siteDescription =
  "Explore os aplicativos e projetos de Raphael Elias. Acesse as aplicações, conheça as tecnologias e consulte o código e a documentação no GitHub.";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = new URL(path, siteUrl).href;
  const pageTitle = path === "/" ? siteTitle : `Raphael Elias - ${title}`;
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
      siteName: "Apps de Raphael Elias",
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
