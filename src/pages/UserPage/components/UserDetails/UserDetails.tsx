import {
  CalendarIcon,
  EyeIcon,
  LockClosedIcon,
  PowerIcon,
  RectangleStackIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { __ } from "@wordpress/i18n";
import React from "react";
import { usePageLinks } from "../../../../hooks/usePageLinks";
import { useTimezone } from "../../../../hooks/useTimezone";
import { ExtendedUser } from "../../../../types/user";

type Props = {
  data: ExtendedUser;
};
function UserDetails({ data }: Props) {
  const { userPage } = usePageLinks();
  const { convertToWPTimezone } = useTimezone();
  const isActive = data.is_active;
  const userPageLink = userPage + "&code=" + data.page_hash;

  return (
    <div className="wpqt-flex wpqt-flex-col wpqt-gap-2">
      <UserDetailItem
        label={__("Name", "quicktasker")}
        value={data.name}
        icon={<UserIcon className="wpqt-size-5 wpqt-icon-blue" />}
      />

      <UserDetailItem
        label={__("Created at", "quicktasker")}
        value={convertToWPTimezone(data.created_at)}
        icon={<CalendarIcon className="wpqt-size-5 wpqt-icon-blue" />}
      />

      <UserDetailItem
        label={__("Assigned tasks count", "quicktasker")}
        value={data.assigned_tasks_count}
        icon={<RectangleStackIcon className="wpqt-size-5 wpqt-icon-blue" />}
      />

      <UserDetailItem
        label={__("Setup completed", "quicktasker")}
        value={
          data.setup_completed
            ? __("Yes", "quicktasker")
            : __("No", "quicktasker")
        }
        icon={<LockClosedIcon className="wpqt-size-5 wpqt-text-yellow-600" />}
      />

      <UserDetailItem
        label={__("Is active", "quicktasker")}
        value={isActive ? __("Yes", "quicktasker") : __("No", "quicktasker")}
        icon={
          <PowerIcon
            className={`wpqt-size-5 ${isActive ? "wpqt-icon-green" : "wpqt-icon-red"}`}
          />
        }
      />

      <UserDetailItem
        label={__("User Page", "quicktasker")}
        value={
          <a href={userPageLink} rel="noreferrer" target="_blank">
            {userPageLink}
          </a>
        }
        icon={<EyeIcon className={`wpqt-size-5 wpqt-icon-blue`} />}
      />
    </div>
  );
}

type UserDetailItemProps = {
  label: string;
  value: string | React.ReactNode;
  icon: React.ReactNode;
};
function UserDetailItem({ label, value, icon }: UserDetailItemProps) {
  return (
    <div className="wpqt-flex wpqt-items-center wpqt-gap-2">
      {icon}
      <span className="wpqt-font-semibold">{label}: </span>
      <span>{value}</span>
    </div>
  );
}

export { UserDetails };
