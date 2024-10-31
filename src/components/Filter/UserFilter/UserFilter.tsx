import { Input } from "@headlessui/react";
import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SET_USERS_SEARCH_VALUE } from "../../../constants";
import { UserContext } from "../../../providers/UserContextProvider";
import { WPQTFilter } from "../WPQTFilter";

function UserFilter() {
  const {
    state: { usersSearchValue },
    userDispatch,
  } = useContext(UserContext);

  const setArchiveSearchValue = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    userDispatch({
      type: SET_USERS_SEARCH_VALUE,
      payload: event.target.value,
    });
  };

  return (
    <WPQTFilter title={__("User filtering", "quicktasker")}>
      <Input
        type="text"
        value={usersSearchValue}
        onChange={setArchiveSearchValue}
      />
    </WPQTFilter>
  );
}

export { UserFilter };
