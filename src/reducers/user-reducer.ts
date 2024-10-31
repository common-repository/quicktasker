import {
  ADD_USER,
  CHANGE_USER_STATUS,
  DELETE_USER,
  EDIT_USER,
  RESET_PASSWORD,
  SET_USERS,
  SET_USERS_SEARCH_VALUE,
} from "../constants";
import { Action, State } from "../providers/UserContextProvider";
import { ServerUser, User } from "../types/user";
import { convertUserFromServer } from "../utils/user";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_USERS: {
      const serverUsers: ServerUser[] = action.payload;
      const users: User[] = serverUsers.map(convertUserFromServer);

      return {
        ...state,
        users,
      };
    }
    case ADD_USER: {
      const serverUser: ServerUser = action.payload;
      const user: User = convertUserFromServer(serverUser);

      return {
        ...state,
        users: [...state.users, user],
      };
    }
    case EDIT_USER: {
      const editedServerUser: ServerUser = action.payload;
      const editedUser: User = convertUserFromServer(editedServerUser);
      const users = state.users.map((user) =>
        user.id === editedUser.id ? editedUser : user,
      );

      return {
        ...state,
        users,
      };
    }
    case CHANGE_USER_STATUS: {
      const { isActive, userId } = action.payload;
      const users = state.users.map((user) =>
        user.id === userId ? { ...user, is_active: isActive } : user,
      );

      return {
        ...state,
        users,
      };
    }
    case RESET_PASSWORD: {
      const userId: string = action.payload;
      const users = state.users.map((user) =>
        user.id === userId ? { ...user, has_password: false } : user,
      );

      return {
        ...state,
        users,
      };
    }
    case DELETE_USER: {
      const userId: string = action.payload;
      const users = state.users.filter((user) => user.id !== userId);

      return {
        ...state,
        users,
      };
    }
    case SET_USERS_SEARCH_VALUE: {
      const usersSearchValue: string = action.payload;

      return {
        ...state,
        usersSearchValue,
      };
    }
    default:
      return state;
  }
};

export { reducer };
