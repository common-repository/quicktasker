type WPQTFilterProps = {
  children: React.ReactNode;
  title: string;
};

function WPQTFilter({ children, title }: WPQTFilterProps) {
  return (
    <div className="wpqt-mb-8">
      <div className="wpqt-mb-2 wpqt-text-base">{title}</div>
      <div className="wpqt-flex wpqt-gap-2 wpqt-items-center">{children}</div>
    </div>
  );
}

export { WPQTFilter };
