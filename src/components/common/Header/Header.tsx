type WPQTPageHeaderProps = {
  children: string;
  description?: string | null;
  icon?: React.ReactNode;
};
function WPQTPageHeader({
  children,
  description = null,
  icon = null,
}: WPQTPageHeaderProps) {
  return (
    <div className="wpqt-mb-6 wpqt-inline-grid wpqt-grid-cols-[auto_auto] wpqt-items-center wpqt-gap-2">
      <div>
        <h1>
          {children}
          {icon && <span className="wpqt-ml-1 wpqt-align-middle">{icon}</span>}
        </h1>
        {description && <div>{description}</div>}
      </div>
    </div>
  );
}

export { WPQTPageHeader };
