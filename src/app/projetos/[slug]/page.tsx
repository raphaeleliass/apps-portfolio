import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { MotionArrow } from "@/components/motion-arrow";
import { MotionLink } from "@/components/motion-link";
import { MotionMain } from "@/components/motion-main";
import { ProjectReadme } from "@/components/project-readme";
import { getCatalog } from "@/lib/github";
import { pageMetadata } from "@/lib/site-metadata";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { projects, status } = await getCatalog();
  if (status === "unavailable" || status === "unconfigured") {
    return {
      title: "Indisponível",
      description:
        "O catálogo de projetos está temporariamente indisponível. Tente novamente em breve.",
      robots: {
        index: false,
        follow: true,
        googleBot: { index: false, follow: true },
      },
    };
  }
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return pageMetadata(
    project.name,
    project.description,
    `/projetos/${encodeURIComponent(project.slug)}`,
  );
}
export default async function ProjectPage({ params }: Props) {
  await connection();
  const { slug } = await params;
  const { projects, status } = await getCatalog();
  if (status === "unavailable" || status === "unconfigured")
    return (
      <MotionMain id="conteudo">
        <div className="notice">
          <h1>Projeto indisponível no momento.</h1>
          <p>Não foi possível consultar o catálogo.</p>
          <MotionLink href="/">Voltar aos projetos</MotionLink>
        </div>
      </MotionMain>
    );
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return (
    <MotionMain id="conteudo" className="project-page">
      <MotionLink className="back" href="/">
        <ArrowLeft size={16} aria-hidden="true" /> Todos os projetos
      </MotionLink>
      <section className="intro">
        <h1>{project.name}</h1>
        <p>{project.description}</p>
      </section>
      <div className="detail-actions">
        {project.website && (
          <a
            className="button"
            href={project.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir aplicativo <MotionArrow />
          </a>
        )}
        <a
          className="icon-link"
          href={project.repository}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver código no GitHub <MotionArrow />
        </a>
      </div>
      {project.language && (
        <p className="language">Linguagem principal: {project.language}</p>
      )}
      {project.readme ? (
        <>
          <div className="reading-progress" aria-hidden="true" />
          <section className="readme">
            <h2>Sobre o projeto</h2>
            <p className="readme-hint">
              README do repositório ·{" "}
              <a
                href={`${project.repository}#readme`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver no GitHub
              </a>
            </p>
            <ProjectReadme
              source={project.readme}
              repository={project.repository}
            />
          </section>
        </>
      ) : (
        <p className="notice">
          Mais informações estão disponíveis no repositório.
        </p>
      )}
    </MotionMain>
  );
}
