import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { getLogsRequest } from "../../../../api/api";
import { WPQTTypes } from "../../../../types/enums";
import { Log } from "../../../../types/log";
import { LogItem } from "../../../Log/LogItem";
import { CommentsAndLogsTabContent } from "../CommentsAndLogsTabContent";

type Props = {
  userId: string;
};

function LogsTabContent({ userId }: Props) {
  const fetchLogs = async () => {
    try {
      const response = await getLogsRequest(userId, WPQTTypes.User);

      return response.data;
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to load log", "quicktasker"));
    }
  };
  return (
    <CommentsAndLogsTabContent<Log>
      typeId={userId}
      fetchData={fetchLogs}
      renderItem={(log: Log) => <LogItem log={log} />}
      noDataMessage={__("No logs available", "quicktasker")}
      explanation={__(
        "Logs can be seen only by WordPress users (with required permissions)",
        "quicktasker",
      )}
    />
  );
}

export { LogsTabContent };
