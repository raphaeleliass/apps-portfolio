import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MotionMain } from "./motion-main";
import { SiteMotion } from "./site-motion";

test("motion renders readable server HTML before JavaScript runs", () => {
  const html = renderToStaticMarkup(
    <SiteMotion>
      <MotionMain id="conteudo" className="project-page">
        <h1>Projeto</h1>
        <p>Conteúdo disponível sem animação.</p>
        <a href="/">Voltar aos projetos</a>
      </MotionMain>
    </SiteMotion>,
  );
  expect(html).toContain('<main id="conteudo" class="project-page">');
  expect(html).toContain("<h1>Projeto</h1>");
  expect(html).toContain('href="/"');
  expect(html).not.toContain("opacity:0");
  expect(html).not.toContain("visibility:hidden");
});
