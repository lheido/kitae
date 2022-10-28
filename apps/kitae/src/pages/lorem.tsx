import { useState } from "react";
import { Button } from "../components/Button";
import { ButtonToggleGroup } from "../components/ButtonToggle";
import { GitlabIcon } from "../components/icons/GitlabIcon";

export default function Lorem() {
  const [selected, setSelected] = useState<string | undefined>("empty");
  const buttonToggleState = [
    { label: "Empty", value: "empty" },
    { label: "From existing", value: "from_existing" },
  ];
  const buttonToggleOnChange = (value: string) => setSelected(value);
  return (
    <div>
      <section className="flex flex-col gap-4 p-10">
        <p>Buttons</p>
        <div className="flex flex-wrap gap-4">
          <Button.default>Default</Button.default>
          <Button.primary>Primary</Button.primary>
          <Button.secondary>Secondary</Button.secondary>
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
        </div>
        <p>Link as button</p>
        <div className="flex flex-wrap gap-4">
          <Button.link.default href="#">Default</Button.link.default>
          <Button.link.primary href="#">Primary</Button.link.primary>
          <Button.link.secondary href="#">Secondary</Button.link.secondary>
        </div>
      </section>
      <section className="flex flex-col gap-4 p-10">
        <p>Button Toggle</p>
        <div className="flex flex-wrap gap-4 bg-dp-1 p-4">
          <ButtonToggleGroup
            name="lorem"
            selected={selected}
            onChange={buttonToggleOnChange}
            states={buttonToggleState}
          />
        </div>
      </section>
    </div>
  );
}
