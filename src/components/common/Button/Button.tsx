import { Button } from "@headlessui/react";
import { LoadingOval } from "../../Loading/Loading";
import { WPQTTooltip } from "../../Tooltip/WPQTTooltip";

enum ButtonType {
  BUTTON = "button",
  SUBMIT = "submit",
  RESET = "reset",
}
type Props = {
  onClick?: () => void;
  btnText: string;
  className?: string;
  type?: ButtonType;
};

function WPQTButton({
  onClick = () => {},
  btnText,
  className,
  type = ButtonType.BUTTON,
}: Props) {
  return (
    <Button
      className={`wpqt-inline-flex wpqt-cursor-pointer wpqt-items-center wpqt-justify-center wpqt-whitespace-nowrap wpqt-rounded-lg wpqt-border wpqt-border-transparent wpqt-bg-blue-500 wpqt-px-3 wpqt-py-1 wpqt-text-sm/6 wpqt-text-white wpqt-transition-[color,background-color,border-color,text-decoration-color,fill,stroke,box-shadow] focus:wpqt-outline-none focus:wpqt-ring-4 focus:wpqt-ring-blue-800 enabled:hover:wpqt-bg-blue-600 ${className}`}
      onClick={onClick}
      type={type}
    >
      {btnText}
    </Button>
  );
}

type WPQTIconButtonProps = {
  icon: React.ReactNode;
  text?: string;
  onClick: () => void;
  className?: string;
  tooltipId?: string;
  tooltipText?: string;
  loading?: boolean;
};
function WPQTIconButton({
  icon,
  text,
  onClick = () => {},
  className,
  tooltipId,
  tooltipText,
  loading = false,
}: WPQTIconButtonProps) {
  const showTooltip = tooltipText && tooltipId;
  const tooltipAttributes: React.HTMLAttributes<HTMLDivElement> = showTooltip
    ? {
        "data-tooltip-id": tooltipId,
        "data-tooltip-content": tooltipText,
        "data-tooltip-position-strategy": "fixed",
        "data-tooltip-variant": "info",
      }
    : {};

  return (
    <div
      {...tooltipAttributes}
      className={`wpqt-main-border wpqt-relative wpqt-inline-flex wpqt-cursor-pointer wpqt-items-center wpqt-justify-center wpqt-gap-2 wpqt-bg-gray-100 wpqt-p-2 hover:wpqt-bg-white ${className}`}
      onClick={onClick}
    >
      {icon}
      {text && (
        <span
          className={`wpqt-whitespace-nowrap ${loading ? "wpqt-invisible" : ""}`}
        >
          {text}
        </span>
      )}
      {loading && (
        <LoadingOval
          width="20"
          height="20"
          className="wpqt-absolute wpqt-top-1/2 wpqt-left-1/2 wpqt-transform-y-center wpqt-transform-x-center"
        />
      )}
      {showTooltip && <WPQTTooltip id={tooltipId} />}
    </div>
  );
}

export { ButtonType, WPQTButton, WPQTIconButton };
