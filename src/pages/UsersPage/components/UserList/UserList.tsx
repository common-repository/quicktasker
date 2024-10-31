import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { NoFilterResults } from "../../../../components/Filter/NoFilterResults/NoFilterResults";
import { useUserFilter } from "../../../../hooks/filters/useUserFilter";
import { UserContext } from "../../../../providers/UserContextProvider";
import { UserListItem } from "../UserListItem/UserListItem";

function UserList() {
  const {
    state: { users },
  } = useContext(UserContext);
  const { filterUsers } = useUserFilter();
  const filteredUsers = users.filter(filterUsers);

  if (users && users.length === 0) {
    return <NoFilterResults text={__("No users found", "quicktasker")} />;
  }

  if (filteredUsers && filteredUsers.length === 0) {
    return <NoFilterResults />;
  }

  return (
    <div className="wpqt-card-grid">
      {filteredUsers.map((user) => {
        return <UserListItem key={user.id} user={user} />;
      })}
    </div>
  );
}

export { UserList };
