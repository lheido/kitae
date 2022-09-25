import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createProject, useProjects } from "../../features/projects";
import { Button } from "../Button";
import { CreateProject } from "../icons/CreateProject";
import { Project } from "../icons/Project";
import DashboardPanel from "./DashboardPanel";

export const queryClient = new QueryClient({
  logger: console,
});

export default function _Dashboard() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export function Dashboard() {
  const { isLoading, error, data } = useProjects();
  return (
    <>
      <DashboardPanel
        title="Projects"
        height={54}
        expandedHeight={200}
        className="h-[400px]"
        icon={<Project />}
      >
        <ul className="flex flex-col p-2 gap-2 pb-4 pt-8">
          <li>
            {isLoading
              ? "Loading projects..."
              : data && data.data.length === 0
              ? "No projects found."
              : "An error occured. Try to refresh the page later."}
          </li>
        </ul>
      </DashboardPanel>
      <DashboardPanel
        title="Create new project"
        height={54}
        expandedHeight={200}
        className="h-[400px] flex-1"
        icon={<CreateProject />}
      >
        <ul className="flex flex-col p-2 gap-2 pb-4 pt-8">
          <li>
            <p className="pb-2 pt-4 pl-1">Design system</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Button onClick={() => createProject("design-system--blank")}>
                  Blank project
                </Button>
              </li>
              <li>
                <Button
                  onClick={() => createProject("design-system--from-gitlab")}
                >
                  From an existing Gitlab project
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <p className="pb-2 pt-4 pl-1">Web Site</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Button onClick={() => createProject("web-site--blank")}>
                  Blank project
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <p className="pb-2 pt-4 pl-1">Web App</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Button onClick={() => createProject("web-app--blank")}>
                  Blank project
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <p className="pb-2 pt-4 pl-1">Flutter</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Button onClick={() => createProject("flutter--blank")}>
                  Blank project
                </Button>
              </li>
            </ul>
          </li>
        </ul>
      </DashboardPanel>
    </>
  );
}
