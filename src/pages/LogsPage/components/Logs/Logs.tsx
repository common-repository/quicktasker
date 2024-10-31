import { Loading } from "../../../../components/Loading/Loading";
import { LogItem } from "../../../../components/Log/LogItem";
import { Log } from "../../../../types/log";

type Props = {
  logs: Log[];
  loading: boolean;
};
const Logs = ({ logs, loading }: Props) => {
  if (loading) {
    return <Loading ovalSize="64" className="wpqt-mt-12" />;
  }
  return (
    <div className="wpqt-logs-grid">
      {logs.map((log) => (
        <LogItem key={log.id} log={log} />
      ))}
    </div>
  );
};

export { Logs };
