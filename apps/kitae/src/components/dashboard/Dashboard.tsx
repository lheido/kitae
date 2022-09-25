import { Button } from "../Button";
import { CreateProject } from "../icons/CreateProject";
import { Project } from "../icons/Project";
import DashboardPanel from "./DashboardPanel";

export default function Dashboard() {
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
          <li>No projects for now.</li>
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
                <Button data-new-project="design-system--blank">
                  Blank project
                </Button>
              </li>
              <li>
                <Button data-new-project="design-system--from-gitlab">
                  From an existing Gitlab project
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <p className="pb-2 pt-4 pl-1">Web Site</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Button data-new-project="web-site--blank">
                  Blank project
                </Button>
              </li>
            </ul>
          </li>
          <li>
            <p className="pb-2 pt-4 pl-1">Web App</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Button data-new-project="web-app--blank">Blank project</Button>
              </li>
            </ul>
          </li>
          <li>
            <p className="pb-2 pt-4 pl-1">Flutter</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <Button data-new-project="flutter--blank">Blank project</Button>
              </li>
            </ul>
          </li>
        </ul>
      </DashboardPanel>
    </>
  );
}
