import {
  CHANGE_USER_SESSION_STATUS,
  DELETE_USER_SESSION,
  SET_USER_SESSIONS,
  SET_USER_SESSIONS_SEARCH_VALUE,
} from "../constants";
import { Action, State } from "../providers/UserSessionsContextProvider";
import { UserSession } from "../types/user-session";
import { convertUserSessionFromServer } from "../utils/user-session";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_USER_SESSIONS_SEARCH_VALUE: {
      return {
        ...state,
        sessionsSearchValue: action.payload ?? "",
      };
    }
    case SET_USER_SESSIONS: {
      const userSessions: UserSession[] = action.payload.map(
        convertUserSessionFromServer,
      );

      return {
        ...state,
        userSessions,
      };
    }
    case CHANGE_USER_SESSION_STATUS: {
      const { sessionId, status } = action.payload;

      return {
        ...state,
        userSessions: state.userSessions.map((session) =>
          session.id === sessionId
            ? { ...session, is_active: status }
            : session,
        ),
      };
    }
    case DELETE_USER_SESSION: {
      const sessionId: string = action.payload;

      return {
        ...state,
        userSessions: state.userSessions.filter(
          (session) => session.id !== sessionId,
        ),
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer };
