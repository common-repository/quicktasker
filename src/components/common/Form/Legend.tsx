import { Legend } from "@headlessui/react";

type Props = {
  children: React.ReactNode;
  className?: string;
};
function WPQTLegend({ children, className }: Props) {
  return (
    <Legend className={`wpqt-lg wpqt-font-bold ${className}`}>
      {children}
    </Legend>
  );
}

export { WPQTLegend };
