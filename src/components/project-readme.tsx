/** biome-ignore-all lint/a11y/noNoninteractiveTabindex: Scrollable tables need keyboard focus. */
import Markdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";

export function ProjectReadme({
  source,
  repository,
}: {
  source: string;
  repository: string;
}) {
  return (
    <article className="markdown-body" aria-label="README do projeto">
      <Markdown
        remarkPlugins={[remarkGfm]}
        skipHtml
        urlTransform={(url, key) => {
          const safe = defaultUrlTransform(url);
          if (!safe) return "";
          const base =
            key === "src"
              ? `${repository.replace("https://github.com/", "https://raw.githubusercontent.com/")}/HEAD/`
              : `${repository}/blob/HEAD/`;
          try {
            return new URL(
              safe,
              url.startsWith("#") ? `${repository}#readme` : base,
            ).href;
          } catch {
            return "";
          }
        }}
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          h2: ({ children }) => <h3>{children}</h3>,
          h3: ({ children }) => <h4>{children}</h4>,
          h4: ({ children }) => <h5>{children}</h5>,
          h5: ({ children }) => <h6>{children}</h6>,
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          table: ({ children }) => (
            <section
              className="markdown-table"
              aria-label="Tabela do README"
              tabIndex={0}
            >
              <table>{children}</table>
            </section>
          ),
        }}
      >
        {source}
      </Markdown>
    </article>
  );
}
