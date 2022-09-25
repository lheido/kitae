import { useQuery } from "@tanstack/react-query";

export const useProjects = () => {
  const query = useQuery(["projects"], () =>
    fetch("/api/projects").then((res) => res.json())
  );
  return query;
};

export type projectTypes =
  | "design-system--blank"
  | "design-system--from-gitlab"
  | "web-site--blank"
  | "web-app--blank"
  | "flutter--blank";

export const createProject = (type: projectTypes) =>
  fetch("/api/projects", { method: "PUT", body: JSON.stringify({ type }) });
