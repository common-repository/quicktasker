import { Label } from "@headlessui/react";

type Props = {
  children: React.ReactNode;
  className?: string;
};
function WPQTLabel({ children, className }: Props) {
  return (
    <Label className={`wpqt-mb-2 wpqt-block ${className}`}>{children}</Label>
  );
}

export { WPQTLabel };
