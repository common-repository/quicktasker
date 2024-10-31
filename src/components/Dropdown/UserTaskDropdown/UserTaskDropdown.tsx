import {
  EllipsisHorizontalIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { __ } from "@wordpress/i18n";
import {
  WPQTDropdown,
  WPQTDropdownIcon,
  WPQTDropdownItem,
} from "../WPQTDropdown";

type Props = {
  taskId: string;
  onUnAssignTask: (taskId: string) => void;
};
function UserTaskDropdown({ taskId, onUnAssignTask }: Props) {
  return (
    <WPQTDropdown
      menuBtn={({ active }) => (
        <WPQTDropdownIcon
          isActive={active}
          IconComponent={EllipsisHorizontalIcon}
        />
      )}
    >
      <WPQTDropdownItem
        text={__("Unassign from task", "quicktasker")}
        icon={<UserMinusIcon className="wpqt-icon-red wpqt-size-4" />}
        onClick={(e) => {
          e.stopPropagation();
          onUnAssignTask(taskId);
        }}
        className="!wpqt-mb-0"
      />
    </WPQTDropdown>
  );
}

export { UserTaskDropdown };
