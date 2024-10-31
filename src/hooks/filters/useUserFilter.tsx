import { useContext } from "@wordpress/element";
import { UserContext } from "../../providers/UserContextProvider";
import { User } from "../../types/user";

const useUserFilter = () => {
  const {
    state: { usersSearchValue },
  } = useContext(UserContext);

  const filterUsers = (user: User) => {
    const matchesSearchValue =
      user.name.toLowerCase().includes(usersSearchValue.toLowerCase()) ||
      (user.description &&
        user.description
          .toLowerCase()
          .includes(usersSearchValue.toLowerCase()));

    return matchesSearchValue;
  };

  return {
    filterUsers,
  };
};

export { useUserFilter };
