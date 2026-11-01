import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, Inter, Manrope } from "next/font/google";
import { MotionArrow } from "@/components/motion-arrow";
import { MotionLink } from "@/components/motion-link";
import { SiteMotion } from "@/components/site-motion";
import { ThemeSelect } from "@/components/theme-select";
import { siteDescription, siteTitle, siteUrl } from "@/lib/site-metadata";
import "./tailwind.css";
import "./globals.css";
const sans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const appNames = Manrope({
  variable: "--font-app-name",
  subsets: ["latin"],
  weight: "600",
  display: "swap",
});
const copy = Inter({
  variable: "--font-copy",
  subsets: ["latin"],
  display: "swap",
});
const serif = Instrument_Serif({
  variable: "--font-serif",
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Apps",
  title: { default: siteTitle, template: "Raphael Elias - %s" },
  description: siteDescription,
  authors: [{ name: "Raphael Elias", url: "https://raphaelelias.dev" }],
  creator: "Raphael Elias",
  publisher: "Raphael Elias",
  category: "technology",
  referrer: "strict-origin-when-cross-origin",
  robots: {
    googleBot: {
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9f8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${sans.variable} ${serif.variable} ${appNames.variable} ${copy.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Static JSON-LD with escaped HTML delimiters.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://raphaelelias.dev/#person",
                  name: "Raphael Elias",
                  url: "https://raphaelelias.dev",
                  sameAs: ["https://github.com/raphaeleliass"],
                },
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: siteTitle,
                  description: siteDescription,
                  inLanguage: "pt-BR",
                  publisher: { "@id": "https://raphaelelias.dev/#person" },
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        <SiteMotion>
          <header>
            <MotionLink className="brand" href="/">
              Raphael Elias
            </MotionLink>
            <nav aria-label="Navegação principal">
              <a
                className="icon-link"
                href="https://github.com/raphaeleliass"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <MotionArrow size={14} />
              </a>
              <ThemeSelect />
            </nav>
          </header>
          {children}
          <footer>
            <a
              href="https://raphaelelias.dev"
              target="_blank"
              rel="noopener noreferrer"
            >
              raphaelelias.dev
            </a>
            <span>Raphael Elias</span>
          </footer>
        </SiteMotion>
      </body>
    </html>
  );
}
