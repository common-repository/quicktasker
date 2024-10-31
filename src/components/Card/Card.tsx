import { clsx } from "clsx";

type WPQTCardProps = {
  children?: React.ReactNode;
  className?: string;
  title: string;
  description?: string;
  onClick?: () => void;
  dropdown?: React.ReactNode;
  childrenClassName?: string;
};

function WPQTCard({
  className,
  onClick,
  title,
  description,
  children,
  dropdown,
}: WPQTCardProps) {
  const hasDropdown = dropdown !== undefined;

  return (
    <div
      className={clsx(
        "wpqt-relative wpqt-flex wpqt-flex-col wpqt-rounded wpqt-border wpqt-border-solid wpqt-border-qtBorder wpqt-p-4",
        hasDropdown && "wpqt-pr-[24px]",
        className,
      )}
      onClick={onClick}
    >
      <div className="wpqt-mb-3">
        <div className="wpqt-text-lg">{title}</div>
        {description && (
          <div className="wpqt-italic wpqt-text-gray-500">{description}</div>
        )}
      </div>
      <div className="wpqt-flex wpqt-flex-col wpqt-h-full">{children}</div>
      {hasDropdown && (
        <div className="wpqt-absolute wpqt-right-2 wpqt-top-1 wpqt-z-10">
          {dropdown}
        </div>
      )}
    </div>
  );
}

type WPQTCardDataItemProps = {
  label: string;
  value?: string;
  valueClassName?: string;
  valueLink?: string;
  icon?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  labelClassName?: string;
};

function WPQTCardDataItem({
  label,
  value,
  valueClassName = "",
  valueLink,
  icon,
  onClick = () => {},
  className = "",
  labelClassName = "",
}: WPQTCardDataItemProps) {
  return (
    <div
      className={`wpqt-mb-2 wpqt-flex wpqt-gap-2 wpqt-items-center ${className}`}
      onClick={onClick}
    >
      {icon && icon}
      <div className={labelClassName}>{value ? `${label}:` : label}</div>

      <div className={`${valueClassName}`}>
        {valueLink ? (
          <a
            href={valueLink}
            target="_blank"
            className="wpqt-text-qtTextBlue wpqt-no-underline"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export { WPQTCard, WPQTCardDataItem };
