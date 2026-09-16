import type { Project, Repository } from "./types";

const isReal = (url?: string): url is string => Boolean(url && !url.startsWith("#"));

/**
 * A project's links without the "#" placeholders, which mark links still to
 * be filled in. Everything that shows or publishes a link reads it from here.
 */
export function projectLinks(project: Project): {
  live?: string;
  repos: Repository[];
} {
  return {
    live: isReal(project.links.live) ? project.links.live : undefined,
    repos: (project.links.repos ?? []).filter((repo) => isReal(repo.url)),
  };
}
