import { useState } from "react";
import { Button } from "../components/Button";
import { ButtonToggleGroup } from "../components/ButtonToggle";
import { Cloud1 } from "../components/deco/Cloud1";
import { Cloud2 } from "../components/deco/Cloud2";
import { Cloud3 } from "../components/deco/Cloud3";
import { IconButton } from "../components/IconButton";
import { CreateProject } from "../components/icons/CreateProject";
import { GitlabIcon } from "../components/icons/GitlabIcon";
import { More } from "../components/icons/More";
import { Project } from "../components/icons/Project";

export default function Lorem() {
  const [selected, setSelected] = useState<string | undefined>("empty");
  const buttonToggleState = [
    { label: "Empty", value: "empty" },
    { label: "From existing", value: "from_existing" },
  ];
  const buttonToggleOnChange = (value: string) => setSelected(value);
  return (
    <div className="bg-dp-1">
      <h1 className="px-10 pt-6 font-bold text-3xl">Kitae UI Kit</h1>
      <section className="flex flex-col gap-4 p-10">
        <p>Buttons</p>
        <div className="flex flex-wrap gap-4">
          <Button.default>Default</Button.default>
          <Button.primary>Primary</Button.primary>
          <Button.secondary>Secondary</Button.secondary>
          <Button.kitae>Kitae</Button.kitae>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button.default>
            <GitlabIcon />
            <span>Default</span>
          </Button.default>
          <Button.primary>
            <GitlabIcon />
            <span>Primary</span>
          </Button.primary>
          <Button.secondary>
            <GitlabIcon />
            <span>Secondary</span>
          </Button.secondary>
          <Button.kitae>
            <GitlabIcon />
            <span>Kitae</span>
          </Button.kitae>
        </div>
        <p>Link as button</p>
        <div className="flex flex-wrap gap-4">
          <Button.link.default href="https://www.google.com">
            Default
          </Button.link.default>
          <Button.link.primary href="https://www.google.com">
            Primary
          </Button.link.primary>
          <Button.link.secondary href="https://www.google.com">
            Secondary
          </Button.link.secondary>
        </div>
        <p>Icon buttons</p>
        <div className="flex flex-wrap gap-4">
          <IconButton.default>
            <More />
          </IconButton.default>
          <IconButton.primary>
            <CreateProject />
          </IconButton.primary>
          <IconButton.secondary>
            <Project />
          </IconButton.secondary>
        </div>
      </section>
      <section className="flex flex-col gap-4 p-10">
        <p>Button Toggle</p>
        <div className="flex flex-wrap gap-4 p-4">
          <ButtonToggleGroup
            name="lorem"
            selected={selected}
            onChange={buttonToggleOnChange}
            states={buttonToggleState}
          />
        </div>
      </section>
      <section className="flex flex-col gap-4 p-10">
        <p>Decoartions</p>
        <div className="flex flex-wrap gap-4 p-4">
          <Cloud1 className="w-48 h-auto" />
          <Cloud2 className="w-48 h-auto" />
          <Cloud3 className="w-48 h-auto" />
        </div>
      </section>
    </div>
  );
}
