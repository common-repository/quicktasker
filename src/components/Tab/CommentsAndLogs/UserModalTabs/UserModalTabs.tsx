import { __ } from "@wordpress/i18n";
import { User } from "../../../../types/user";
import { WPQTTabs } from "../../WPQTTabs";
import { LogsTabContent } from "./LogsTabContent";
import { PrivateCommentsTabContent } from "./PrivateCommentsTabContent";
import { PublicCommentsTabContent } from "./PublicCommentsTabContent";

type Props = {
  user: User;
};
function UserModalTabs({ user }: Props) {
  const tabs = [
    __("Private comments", "quicktasker"),
    __("Public comments", "quicktasker"),
    __("Logs", "quicktasker"),
  ];

  return (
    <WPQTTabs
      tabs={tabs}
      tabsContent={[
        <PrivateCommentsTabContent userId={user.id} key={1} />,
        <PublicCommentsTabContent userId={user.id} key={2} />,
        <LogsTabContent userId={user.id} key={3} />,
      ]}
    />
  );
}

export { UserModalTabs };
