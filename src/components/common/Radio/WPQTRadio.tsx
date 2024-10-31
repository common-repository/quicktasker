import { Field, Label, Radio, RadioGroup } from "@headlessui/react";

type Props = {
  selected: string;
  selections: [];
  onSelectionChange: (selected: string) => void;
};
function WPQTRadion({ selected, selections, onSelectionChange }: Props) {
  return (
    <RadioGroup
      value={selected}
      onChange={onSelectionChange}
      className="wpqt-flex wpqt-gap-2"
    >
      {selections.map((selection) => (
        <Field key={selection} className="wpqt-flex wpqt-gap-2">
          <Radio
            value={selection}
            className="wpqt-group wpqt-flex wpqt-size-5 wpqt-items-center wpqt-justify-center wpqt-rounded-full wpqt-border data-[checked]:wpqt-bg-blue-400"
          >
            <span className="wpqt-invisible wpqt-size-2 wpqt-rounded-full wpqt-bg-white group-data-[checked]:wpqt-visible" />
          </Radio>
          <Label>{selection}</Label>
        </Field>
      ))}
    </RadioGroup>
  );
}

export { WPQTRadion };
