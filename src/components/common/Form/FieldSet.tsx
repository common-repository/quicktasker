import { Fieldset } from "@headlessui/react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

function WPQTFieldSet({ children, className }: Props) {
  return (
    <Fieldset className={`wpqt-border-none ${className}`}>{children}</Fieldset>
  );
}

export { WPQTFieldSet };
