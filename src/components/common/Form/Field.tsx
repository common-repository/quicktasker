import { Field } from "@headlessui/react";

type Props = {
  children: React.ReactNode;
  className?: string;
};
function WPQTField({ children, className }: Props) {
  return <Field className={className}>{children}</Field>;
}

export { WPQTField };
