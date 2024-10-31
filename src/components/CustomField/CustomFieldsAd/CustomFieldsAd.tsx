import { __ } from "@wordpress/i18n";

function CustomFieldsAd() {
  return (
    <div className="wpqt-flex wpqt-flex-col wpqt-items-center wpqt-justify-center wpqt-h-full">
      <h2 className="wpqt-font-semibold">{__("Custom fields")}</h2>
      <div className="wpqt-text-center wpqt-mb-4">
        {__(
          "Premium feature to create and manage custom data fields. Allows to add extra data to tasks and users.",
        )}
      </div>
      <div className="wpqt-text-blue-500 wpqt-font-semibold">
        {__("Coming soon", "quicktasker")}
      </div>
    </div>
  );
}

export { CustomFieldsAd };
