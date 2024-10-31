import {
  SET_INIT_DATA,
  SET_USER_LOGGED_IN,
  SET_USER_PAGE_STATUS,
} from "../constants";
import { Action, State } from "../providers/UserPageAppContextProvider";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_USER_PAGE_STATUS: {
      const { isActiveUser, isLoggedIn, setupCompleted, userId, userName } =
        action.payload;

      return {
        ...state,
        isActiveUser: isActiveUser === "1",
        isLoggedIn,
        setupCompleted,
        initialLoading: false,
        userId,
        userName,
      };
    }
    case SET_USER_LOGGED_IN: {
      const isLoggedIn: boolean = action.payload;

      return {
        ...state,
        isLoggedIn,
      };
    }
    case SET_INIT_DATA: {
      const { timezone } = action.payload;

      return {
        ...state,
        timezone,
      };
    }
    default:
      return state;
  }
};

export { reducer };
