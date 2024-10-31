import { __ } from "@wordpress/i18n";
import { useTimezone } from "../../hooks/useTimezone";
import { WPQTLogCreatedBy } from "../../types/enums";
import { Log } from "../../types/log";

type Props = {
  log: Log;
};
const LogItem = ({ log }: Props) => {
  const { convertToWPTimezone } = useTimezone();

  return (
    <>
      <div>
        <div className="wpqt-text-center wpqt-mb-1">{log.author_name}</div>
        <div className="wpqt-text-center">
          {log.created_by === WPQTLogCreatedBy.Admin
            ? __("Admin", "quicktasker")
            : __("QuickTasker", "quicktasker")}
        </div>
      </div>
      <div>{log.text}</div>
      <div>{convertToWPTimezone(log.created_at)}</div>
    </>
  );
};

export { LogItem };
