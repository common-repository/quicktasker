import { convertUserFromServer } from "../../utils/user";
import {
  SET_USER_PAGE_USER_DATA,
  SET_USER_PAGE_USER_LOADING,
} from "../constants";
import { Action, State } from "../providers/UserPageUserContextProvider";
import { UserPageUserResponse } from "../types/user-page-user-response";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_USER_PAGE_USER_DATA: {
      const { user, customFields }: UserPageUserResponse = action.payload;

      return {
        ...state,
        user: convertUserFromServer(user),
        customFields,
      };
    }
    case SET_USER_PAGE_USER_LOADING: {
      const loading: boolean = action.payload;

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
