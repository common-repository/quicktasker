type Props = {
  children: React.ReactNode;
};
function DataDisplay({ children }: Props) {
  return <div>{children}</div>;
}

type RowProps = {
  children: React.ReactNode;
  label: string;
  className?: string;
};
function DisplayRow({ children, label, className = "" }: RowProps) {
  return (
    <div className={`wpqt-mb-1 ${className}`}>
      <span className="wpqt-font-semibold">{label}</span>
      <span className="wpqt-text-base">{children}</span>
    </div>
  );
}

export { DataDisplay, DisplayRow };
