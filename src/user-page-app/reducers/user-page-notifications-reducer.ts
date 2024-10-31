import {
  CHANGE_USER_PAGE_NOTIFICATIONS_LOADING,
  SET_USER_PAGE_NOTIFICATIONS_NEW_COMMENTS,
} from "../constants";
import {
  Action,
  State,
} from "../providers/UserPageNotificationsContextProvider";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_USER_PAGE_NOTIFICATIONS_NEW_COMMENTS: {
      const newComments = action.payload;

      return {
        ...state,
        newComments,
      };
    }
    case CHANGE_USER_PAGE_NOTIFICATIONS_LOADING: {
      const loading = action.payload;

      return {
        ...state,
        loading,
      };
    }
    default:
      return state;
  }
};

export { reducer };
