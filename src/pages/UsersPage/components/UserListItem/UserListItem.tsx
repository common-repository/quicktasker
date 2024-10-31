import { EyeIcon, PowerIcon } from "@heroicons/react/24/outline";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { WPQTCard, WPQTCardDataItem } from "../../../../components/Card/Card";
import { UserDropdown } from "../../../../components/Dropdown/UserDropdown/UserDropdown";
import { OPEN_EDIT_USER_MODAL } from "../../../../constants";
import { usePageLinks } from "../../../../hooks/usePageLinks";
import { ModalContext } from "../../../../providers/ModalContextProvider";
import { User } from "../../../../types/user";

type Props = {
  user: User;
};

function UserListItem({ user }: Props) {
  const { userPage } = usePageLinks();
  const { modalDispatch } = useContext(ModalContext);

  const userIsActive = user.is_active;
  const userPageLink = userPage + "&code=" + user.page_hash;

  return (
    <WPQTCard
      title={user.name}
      description={user.description}
      dropdown={<UserDropdown user={user} />}
      onClick={() => {
        modalDispatch({
          type: OPEN_EDIT_USER_MODAL,
          payload: user,
        });
      }}
      className="wpqt-cursor-pointer"
    >
      <WPQTCardDataItem
        className="hover:wpqt-underline wpqt-self-start"
        label={__("Open user page", "quicktasker")}
        icon={<EyeIcon className="wpqt-size-5 wpqt-icon-blue" />}
        onClick={(e) => {
          e.stopPropagation();
          window.open(userPageLink, "_blank");
        }}
      />

      <WPQTCardDataItem
        className="hover:wpqt-underline wpqt-self-start"
        label={__("View user details", "quicktasker")}
        icon={<EyeIcon className="wpqt-size-5 wpqt-icon-blue" />}
        onClick={(e) => {
          e.stopPropagation();
          window.location.hash = `#/users/${user.id}`;
        }}
      />

      <WPQTCardDataItem
        label={__("Status", "quicktasker")}
        value={
          userIsActive
            ? __("Active", "quicktasker")
            : __("Disabled", "quicktasker")
        }
        valueClassName={
          userIsActive
            ? "wpqt-text-qtTextGreen wpqt-font-bold"
            : "wpqt-text-qtTextRed wpqt-font-bold"
        }
        icon={
          <PowerIcon
            className={`wpqt-size-5 ${userIsActive ? "wpqt-icon-green" : "wpqt-icon-red"}`}
          />
        }
      />
    </WPQTCard>
  );
}

export { UserListItem };
