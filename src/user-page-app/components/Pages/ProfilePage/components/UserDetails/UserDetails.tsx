import { __ } from "@wordpress/i18n";
import {
  DataDisplay,
  DisplayRow,
} from "../../../../../../components/common/DataDisplay/DataDisplay";
import { User } from "../../../../../../types/user";

type Props = {
  user: User | null;
};
function UserDetails({ user }: Props) {
  if (!user) {
    return null;
  }
  const rowClasses =
    "wpqt-flex wpqt-flex-col wpqt-items-center wpqt-mb-4 wpqt-gap-1 wpqt-text-xl";

  return (
    <div className="wpqt-mb-4">
      <DataDisplay>
        <DisplayRow label={__("Name", "quicktasker")} className={rowClasses}>
          {user.name}
        </DisplayRow>
        {user.description && (
          <DisplayRow
            label={__("Description", "quicktasker")}
            className={rowClasses}
          >
            {user.description}
          </DisplayRow>
        )}
        <DisplayRow
          label={__("Assigned tasks count", "quicktasker")}
          className={rowClasses}
        >
          {user.assigned_tasks_count}
        </DisplayRow>
      </DataDisplay>
    </div>
  );
}

export { UserDetails };
