import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Fieldset,
  Label,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { TfiSave } from "react-icons/tfi";
import { WPQTIconButton } from "../common/Button/Button";
import { WPQTTooltip } from "../Tooltip/WPQTTooltip";

type Props = {
  children: React.ReactNode;
  modalOpen: boolean;
  closeModal: () => void;
  size?: "sm" | "md" | "lg" | "xl";
};
function WPQTModal({ modalOpen, closeModal, children, size = "sm" }: Props) {
  const sizeClasses = {
    sm: "wpqt-max-w-sm",
    md: "wpqt-max-w-lg",
    lg: "wpqt-max-w-4xl",
    xl: "wpqt-max-w-6xl",
  };

  return (
    <Dialog
      open={modalOpen}
      as="div"
      className="wpqt-relative wpqt-z-9999 focus:wpqt-outline-none"
      onClose={closeModal}
    >
      <DialogBackdrop className="wpqt-fixed wpqt-inset-0 wpqt-bg-black/40" />
      <div className="wpqt-fixed wpqt-inset-0 wpqt-z-10 wpqt-w-screen wpqt-overflow-y-auto">
        <div className="wpqt-mt-[8vh] wpqt-flex wpqt-justify-center">
          <DialogPanel
            transition
            className={`data-[closed]:wpqt-transform-[wpqt-scale(95%)] wpqt-relative wpqt-mt-[20px] wpqt-w-4/5 ${sizeClasses[size]} wpqt-rounded-xl wpqt-bg-white wpqt-p-8 wpqt-backdrop-blur-2xl wpqt-duration-300 wpqt-ease-out data-[closed]:wpqt-opacity-0`}
          >
            <div
              className="wpqt-group wpqt-absolute wpqt-right-[-20px] wpqt-top-[-20px] wpqt-flex wpqt-h-[40px] wpqt-w-[40px] wpqt-cursor-pointer wpqt-items-center wpqt-justify-center wpqt-rounded-full wpqt-border wpqt-border-solid wpqt-bg-white wpqt-text-qtBorder"
              onClick={closeModal}
            >
              <XMarkIcon className="wpqt-icon-blue group-hover:wpqt-icon-red wpqt-size-5" />
            </div>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

function WPQTModalTitle({ children }: { children: React.ReactNode }) {
  return (
    <DialogTitle
      as="div"
      className="wpqt-text-base/7 wpqt-font-medium wpqt-text-black"
    >
      {children}
    </DialogTitle>
  );
}

function WPQTModalFieldSet({ children }: { children: React.ReactNode }) {
  return <Fieldset>{children}</Fieldset>;
}

function WPQTModalField({
  label,
  children,
  tooltipId,
  tooltipText,
}: {
  label: string;
  children: React.ReactNode;
  tooltipId?: string;
  tooltipText?: string;
}) {
  const showToolTip = tooltipId && tooltipText;
  const tooltipAttributes: React.HTMLAttributes<HTMLLabelElement> = showToolTip
    ? {
        "data-tooltip-id": tooltipId,
        "data-tooltip-content": tooltipText,
        "data-tooltip-position-strategy": "fixed",
        "data-tooltip-variant": "info",
        "data-tooltip-place": "top-end",
      }
    : {};

  return (
    <Field className="wpqt-mb-3">
      <Label
        className="wpqt-mb-2 wpqt-block wpqt-text-sm/6 wpqt-font-medium"
        {...tooltipAttributes}
      >
        {label}
      </Label>
      {children}
      {showToolTip && <WPQTTooltip id={tooltipId} />}
    </Field>
  );
}

function WPQTModalFooter({
  onSave,
  saveBtnText,
  loading = false,
}: {
  onSave: () => void;
  saveBtnText: string;
  loading?: boolean;
}) {
  return (
    <div className="wpqt-mt-4 wpqt-flex wpqt-justify-end">
      <WPQTIconButton
        text={saveBtnText}
        loading={loading}
        icon={<TfiSave className="wpqt-icon-blue wpqt-size-4" />}
        onClick={onSave}
      />
    </div>
  );
}

export {
  WPQTModal,
  WPQTModalField,
  WPQTModalFieldSet,
  WPQTModalFooter,
  WPQTModalTitle,
};
