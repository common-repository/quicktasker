import { useEffect, useState } from "@wordpress/element";
import { toast } from "react-toastify";
import { getGlobalLogsRequest } from "../../../../api/api";
import { LogsFilter } from "../../../../components/Filter/LogsFilter/LogsFilter";
import { Log } from "../../../../types/log";
import { Logs } from "../Logs/Logs";

enum LogTypeEnum {
  Pipeline = "pipeline",
  Stage = "stage",
  Task = "task",
  All = "all",
}

enum LogCreatedByEnum {
  Admin = "admin",
  Quicktasker = "quicktasker_user",
  All = "all",
}

enum LogOrderEnum {
  Asc = "asc",
  Desc = "desc",
}

enum LogNumberEnum {
  Hundred = "100",
  TwoHundred = "200",
  FiveHundred = "500",
  All = "all",
}

type LogsFilterType = {
  numberOfLogs: string;
  type: LogTypeEnum;
  createdBy: LogCreatedByEnum;
  order: LogOrderEnum;
};
type ServerLogsFilterType = Partial<
  Pick<LogsFilterType, "numberOfLogs" | "type" | "createdBy">
>;

const LogsPageContent = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filterSettings, setFilterSettings] = useState<LogsFilterType>({
    numberOfLogs: LogNumberEnum.Hundred,
    type: LogTypeEnum.All,
    createdBy: LogCreatedByEnum.All,
    order: LogOrderEnum.Desc,
  });
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [shouldFetchLogs, setShouldFetchLogs] = useState(true);

  useEffect(() => {
    if (shouldFetchLogs) {
      fetchLogs();
      setShouldFetchLogs(false);
    }
  }, [filterSettings, shouldFetchLogs]);

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const filter = { ...filterSettings } as ServerLogsFilterType;
      if (filter.numberOfLogs === LogNumberEnum.All) {
        delete filter.numberOfLogs;
      }
      if (filter.type === LogTypeEnum.All) {
        delete filter.type;
      }
      if (filter.createdBy === LogCreatedByEnum.All) {
        delete filter.createdBy;
      }
      const response = await getGlobalLogsRequest(filter);
      setLogs(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch logs");
    } finally {
      setLoadingLogs(false);
    }
  };

  const applyFilter = async (appliedFilterSettings: LogsFilterType) => {
    setFilterSettings(appliedFilterSettings);
    setShouldFetchLogs(true);
  };

  return (
    <div>
      <LogsFilter
        filterSettings={filterSettings}
        setFilterSettings={applyFilter}
      />
      <Logs logs={logs} loading={loadingLogs} />
    </div>
  );
};

export {
  LogCreatedByEnum,
  LogNumberEnum,
  LogOrderEnum,
  LogsPageContent,
  LogTypeEnum,
  type LogsFilterType,
  type ServerLogsFilterType,
};
