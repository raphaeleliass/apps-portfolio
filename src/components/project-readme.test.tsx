import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ProjectReadme } from "./project-readme";

test("renders GitHub Markdown, resolves repository assets and rejects unsafe content", () => {
  const html = renderToStaticMarkup(
    <ProjectReadme
      repository="https://github.com/example/project"
      source={
        "# Title\n\n**Strong** and ~~removed~~\n\n- [x] Done\n\n| A | B |\n| - | - |\n| 1 | 2 |\n\n```ts\nconst x = 1;\n```\n\n[Guide](docs/guide.md)\n\n![Preview](./assets/preview.png)\n\n[Unsafe](javascript:alert)\n\n[Malformed](http://[)\n\n<script>alert(1)</script>"
      }
    />,
  );
  expect(html).toContain("<h2>Title</h2>");
  expect(html).toContain("<strong>Strong</strong>");
  expect(html).toContain("<del>removed</del>");
  expect(html).toContain('type="checkbox"');
  expect(html).toContain("<table>");
  expect(html).toContain('class="language-ts"');
  expect(html).toContain(
    'href="https://github.com/example/project/blob/HEAD/docs/guide.md"',
  );
  expect(html).toContain(
    'src="https://raw.githubusercontent.com/example/project/HEAD/assets/preview.png"',
  );
  expect(html).toContain('rel="noopener noreferrer"');
  expect(html).not.toContain("javascript:");
  expect(html).not.toContain("<script>");
});
