import type { Project } from "./project-data";

// Keep these summaries aligned with the apps when their purpose changes.
const summaries: Record<string, { title: string; description: string }> = {
  "https://github.com/raphaeleliass/portfolio": {
    title: "Portfólio pessoal e projetos",
    description:
      "Conheça o portfólio de Raphael Elias: projetos de software, competências em desenvolvimento e publicações do blog, reunidos em uma aplicação TypeScript.",
  },
  "https://github.com/raphaeleliass/jornaleiro_bot": {
    title: "Jornaleiro Bot: notícias do dia no Telegram",
    description:
      "Receba as principais notícias do dia no Telegram com o Jornaleiro Bot. Conheça o projeto, desenvolvido com Hono, Drizzle ORM e Bun, e veja o código no GitHub.",
  },
  "https://github.com/raphaeleliass/linkasaur": {
    title: "Linkasaur: organize e compartilhe seus links",
    description:
      "Organize e compartilhe seus links com o Linkasaur. Explore a aplicação full-stack, a API com Hono e Prisma e o código do projeto no GitHub.",
  },
  "https://github.com/raphaeleliass/rapha_codes": {
    title: "Rapha Codes: blog com Next.js e TypeScript",
    description:
      "Conheça o Rapha Codes, blog de Raphael Elias com Next.js e TypeScript. Explore a arquitetura com Turborepo, a API em Hono e o código no GitHub.",
  },
  "https://github.com/raphaeleliass/bside": {
    title: "Bside: redescubra suas músicas no Spotify",
    description:
      "Redescubra músicas entre as faixas que você mais ouviu no Spotify com o Bside. Conheça a aplicação, sua integração com a API do Spotify e o código no GitHub.",
  },
};

export function projectSeo(project: Project) {
  return (
    summaries[project.repository] ?? {
      title: project.name,
      description:
        project.description.trim() ||
        `Conheça ${project.name}, projeto de software de Raphael Elias. Consulte o código e a documentação no GitHub.`,
    }
  );
}
