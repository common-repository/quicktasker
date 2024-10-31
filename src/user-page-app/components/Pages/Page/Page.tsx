import { NavigationBar } from "../../Navigation/Navigation";

type Props = {
  children: React.ReactNode;
  loading?: boolean;
  onRefresh?: () => void;
  className?: string;
};

function PageWrap({ children, loading = false, onRefresh, className }: Props) {
  return (
    <div className="wpqt-flex wpqt-flex-col">
      <div
        className={`wpqt-user-app-content-height wpqt-order-1 wpqt-overflow-y-auto lg:wpqt-order-2 ${className}`}
      >
        {children}
      </div>
      <div className="wpqt-order-2 lg:wpqt-order-1">
        <NavigationBar loading={loading} onRefresh={onRefresh} />
      </div>
    </div>
  );
}

function PageContentWrap({ children }: Props) {
  return <div className="wpqt-p-4">{children}</div>;
}

type PageScreenMiddleProps = {
  children: React.ReactNode;
};
function PageScreenMiddle({ children }: PageScreenMiddleProps) {
  return (
    <div className="wpqt-flex wpqt-h-screen wpqt-flex-col wpqt-items-center wpqt-justify-center">
      {children}
    </div>
  );
}

type PageTitleProps = {
  children: React.ReactNode;
  description?: string;
  titleClassName?: string;
  className?: string;
};
function PageTitle({
  children,
  description,
  titleClassName = "",
  className = "",
}: PageTitleProps) {
  return (
    <div className={`wpqt-mb-6 ${className}`}>
      <h1
        className={`wpqt-m-0 wpqt-text-center wpqt-text-2xl wpqt-font-normal ${titleClassName}`}
      >
        {children}
      </h1>
      {description && (
        <div className="wpqt-mt-1 wpqt-text-center wpqt-text-gray-600">
          {description}
        </div>
      )}
    </div>
  );
}

export { PageContentWrap, PageScreenMiddle, PageTitle, PageWrap };
