import { expect, test } from "bun:test";
import robots from "../app/robots";
import {
  pageMetadata,
  siteDescription,
  siteTitle,
  siteUrl,
} from "./site-metadata";

test("home metadata uses the production canonical and a complete sharing card", () => {
  const metadata = pageMetadata(siteTitle, siteDescription, "/");
  expect(metadata.title).toEqual({ absolute: siteTitle });
  expect(metadata.alternates?.canonical).toBe(`${siteUrl}/`);
  expect(metadata.openGraph).toMatchObject({
    url: `${siteUrl}/`,
    locale: "pt_BR",
    title: siteTitle,
    images: [
      { url: `${siteUrl}/social-preview.png`, width: 1200, height: 630 },
    ],
  });
  expect(metadata.twitter).toMatchObject({
    card: "summary_large_image",
    title: siteTitle,
  });
});

test("project metadata replaces home URLs and titles consistently", () => {
  const metadata = pageMetadata(
    "escala",
    "Gestão de escalas.",
    "/projetos/escala",
  );
  expect(metadata.title).toEqual({ absolute: "Raphael Elias - escala" });
  expect(metadata.alternates?.canonical).toBe(`${siteUrl}/projetos/escala`);
  expect(metadata.openGraph).toMatchObject({
    url: `${siteUrl}/projetos/escala`,
    title: "Raphael Elias - escala",
    description: "Gestão de escalas.",
  });
  expect(metadata.twitter).toMatchObject({
    title: "Raphael Elias - escala",
    description: "Gestão de escalas.",
  });
});

test("robots points to the sitemap and excludes API routes", () => {
  expect(robots()).toMatchObject({
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  });
});
