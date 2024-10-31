import { FunnelIcon } from "@heroicons/react/24/outline";
import { useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
  LogCreatedByEnum,
  LogNumberEnum,
  LogOrderEnum,
  LogsFilterType,
  LogTypeEnum,
} from "../../../pages/LogsPage/components/LogsPageContent/LogsPageContent";
import { WPQTIconButton } from "../../common/Button/Button";
import { WPQTSelect } from "../../common/Select/WPQTSelect";
import { WPQTFilter } from "../WPQTFilter";

type Props = {
  filterSettings: LogsFilterType;
  setFilterSettings: (filterSettings: LogsFilterType) => void;
};
const LogsFilter = ({ filterSettings, setFilterSettings }: Props) => {
  const [localFilterSettings, setLocalFilterSettings] =
    useState<LogsFilterType>(filterSettings);

  return (
    <WPQTFilter title={__("Logs filtering", "quicktasker")}>
      <WPQTSelect
        allSelector={false}
        selectedOptionValue={localFilterSettings.type}
        options={[
          {
            label: __("All types", "quicktasker"),
            value: LogTypeEnum.All,
          },
          {
            label: __("Board", "quicktasker"),
            value: LogTypeEnum.Pipeline,
          },
          {
            label: __("Stage", "quicktasker"),
            value: LogTypeEnum.Stage,
          },
          {
            label: __("Task", "quicktasker"),
            value: LogTypeEnum.Task,
          },
        ]}
        onSelectionChange={(selection: string) => {
          setLocalFilterSettings({
            ...localFilterSettings,
            type: selection as LogTypeEnum,
          });
        }}
      />
      <WPQTSelect
        allSelector={false}
        selectedOptionValue={localFilterSettings.createdBy}
        options={[
          {
            label: __("Everyone", "quicktasker"),
            value: LogCreatedByEnum.All,
          },
          {
            label: __("Admin", "quicktasker"),
            value: LogCreatedByEnum.Admin,
          },
          {
            label: "QuickTasker",
            value: LogCreatedByEnum.Quicktasker,
          },
        ]}
        onSelectionChange={(selection: string) => {
          setLocalFilterSettings({
            ...localFilterSettings,
            createdBy: selection as LogCreatedByEnum,
          });
        }}
      />

      <WPQTSelect
        allSelector={false}
        selectedOptionValue={localFilterSettings.numberOfLogs}
        options={[
          {
            label: __("Show 100", "quicktasker"),
            value: LogNumberEnum.Hundred,
          },
          {
            label: __("Show 200", "quicktasker"),
            value: LogNumberEnum.TwoHundred,
          },
          {
            label: "Show 500",
            value: LogNumberEnum.FiveHundred,
          },
          {
            label: "Show all",
            value: LogNumberEnum.All,
          },
        ]}
        onSelectionChange={(selection: string) => {
          setLocalFilterSettings({
            ...localFilterSettings,
            numberOfLogs: selection as LogCreatedByEnum,
          });
        }}
      />

      <WPQTSelect
        allSelector={false}
        selectedOptionValue={localFilterSettings.order}
        options={[
          {
            label: __("ASC", "quicktasker"),
            value: LogOrderEnum.Asc,
          },
          {
            label: __("DESC", "quicktasker"),
            value: LogOrderEnum.Desc,
          },
        ]}
        onSelectionChange={(selection: string) => {
          setLocalFilterSettings({
            ...localFilterSettings,
            order: selection as LogOrderEnum,
          });
        }}
      />

      <WPQTIconButton
        text={__("Apply filter", "quicktasker")}
        icon={<FunnelIcon className="wpqt-size-5 wpqt-icon-blue" />}
        onClick={() => setFilterSettings(localFilterSettings)}
      />
    </WPQTFilter>
  );
};

export { LogsFilter };
