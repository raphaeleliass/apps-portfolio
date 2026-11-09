import { connection } from "next/server";
import { AppsIntro } from "@/components/apps-intro";
import { MotionArrow } from "@/components/motion-arrow";
import { MotionLink } from "@/components/motion-link";
import { MotionMain } from "@/components/motion-main";
import { StructuredData } from "@/components/structured-data";
import { getCatalog } from "@/lib/github";
import { projectSeo } from "@/lib/project-seo";
import {
  catalogStructuredData,
  pageMetadata,
  siteDescription,
  siteTitle,
} from "@/lib/site-metadata";
export const metadata = pageMetadata(siteTitle, siteDescription, "/");

export default async function Home() {
  await connection();
  const { projects, status } = await getCatalog();
  return (
    <MotionMain id="conteudo" className="apps-screen">
      {(status === "ready" || status === "stale") && (
        <StructuredData data={catalogStructuredData(projects)} />
      )}
      <AppsIntro />
      <section className="catalog" aria-label="Aplicativos selecionados">
        {status === "unconfigured" && (
          <div className="notice">
            <h2>O catálogo está sendo preparado.</h2>
            <p>Em breve, os projetos selecionados estarão por aqui.</p>
            <a
              href="https://github.com/raphaeleliass"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explorar no GitHub
            </a>
          </div>
        )}
        {status === "unavailable" && (
          <div className="notice">
            <h2>Não foi possível carregar os projetos.</h2>
            <p>Tente atualizar a página ou acesse o GitHub.</p>
            <a
              href="https://github.com/raphaeleliass"
              target="_blank"
              rel="noopener noreferrer"
            >
              Explorar no GitHub
            </a>
          </div>
        )}
        {status === "stale" && (
          <p className="status">
            Exibindo a última seleção disponível. A atualização será tentada
            novamente na próxima visita.
          </p>
        )}
        {(status === "ready" || status === "stale") &&
          projects.length === 0 && (
            <p className="notice">Nenhum projeto público fixado no momento.</p>
          )}
        <ul className="projects">
          {projects.map((project) => (
            <li key={project.slug}>
              <div className="project-info">
                <h2>
                  <MotionLink href={`/projetos/${project.slug}`}>
                    {project.name}
                  </MotionLink>
                </h2>
                <p className="project-description">
                  {projectSeo(project).description}
                </p>
                <MotionLink
                  className="details"
                  aria-label={`Ver detalhes de ${project.name}`}
                  href={`/projetos/${project.slug}`}
                >
                  Ver detalhes
                </MotionLink>
              </div>
              <div className="project-actions">
                {project.website ? (
                  <a
                    className="open-app"
                    href={project.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${project.name} em outra aba`}
                  >
                    Abrir <MotionArrow />
                  </a>
                ) : (
                  <a
                    className="open-app"
                    href={project.repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ver ${project.name} no GitHub em outra aba`}
                  >
                    GitHub <MotionArrow />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </MotionMain>
  );
}
