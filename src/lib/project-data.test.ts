import { describe, expect, test } from "bun:test";
import { parseProjects, safeWebsite } from "./project-data";

const publicRepo = {
  name: "project",
  description: "Example",
  url: "https://github.com/user/project",
  homepageUrl: "https://example.com",
  isPrivate: false,
  primaryLanguage: { name: "TypeScript" },
  readme: { text: "# Project" },
};
function response(nodes: unknown[]) {
  return { data: { user: { pinnedItems: { nodes } } } };
}
describe("GitHub trust boundary", () => {
  test("keeps order and excludes private repositories", () => {
    expect(
      parseProjects(
        response([
          publicRepo,
          { ...publicRepo, name: "secret", isPrivate: true },
          { ...publicRepo, name: "second" },
        ]),
      ).map((item) => item.slug),
    ).toEqual(["project", "second"]);
  });
  test("rejects script URLs, credentials and malformed URLs", () => {
    for (const value of [
      "javascript:alert(1)",
      "data:text/html,x",
      "https://user:pass@example.com",
      "garbage",
      null,
    ])
      expect(safeWebsite(value)).toBeNull();
  });
  test("handles missing optional data", () => {
    const [project] = parseProjects(
      response([
        {
          ...publicRepo,
          homepageUrl: "",
          description: null,
          primaryLanguage: null,
          readme: null,
        },
      ]),
    );
    expect(project.website).toBeNull();
    expect(project.readme).toBeNull();
    expect(project.language).toBeNull();
  });
  test("rejects API failures and invalid repository data", () => {
    for (const value of [
      { errors: [{ message: "Denied" }] },
      response([{ ...publicRepo, name: "../secret" }]),
      response([{ ...publicRepo, url: "https://evil.example/repo" }]),
    ])
      expect(() => parseProjects(value)).toThrow();
  });
  test("does not publish arbitrary response fields", () => {
    expect(
      parseProjects(response([{ ...publicRepo, token: "secret" }]))[0],
    ).not.toHaveProperty("token");
  });
});
