import { Textarea } from "@headlessui/react";
import { clsx } from "clsx";

type Props = {
  value: string;
  onChange: (newValue: string) => void;
  rowsCount?: number;
  className?: string;
};
function WPQTTextarea({ value, onChange, rowsCount = 3, className }: Props) {
  return (
    <Textarea
      className={clsx(
        "wpqt-border-1 wpqt-mb-3 wpqt-block wpqt-resize-none wpqt-rounded-lg wpqt-border-qtBorder wpqt-px-3 wpqt-py-1.5 wpqt-text-sm/6",
        `focus:wpqt-shadow-none focus:wpqt-outline-none data-[focus]:wpqt-outline-2 data-[focus]:wpqt--outline-offset-2 data-[focus]:wpqt-outline-gray-300 ${className}`,
      )}
      rows={rowsCount}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

export { WPQTTextarea };
