import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { getUserSessionsRequest } from "../api/api";
import {
  CHANGE_USER_SESSION_STATUS,
  DELETE_USER_SESSION,
  SET_FULL_PAGE_LOADING,
  SET_USER_SESSIONS,
  SET_USER_SESSIONS_SEARCH_VALUE,
} from "../constants";
import { reducer } from "../reducers/user-sessions-reducer";
import { ServerUserSession, UserSession } from "../types/user-session";
import { LoadingContext } from "./LoadingContextProvider";

const initialState = {
  loading: true,
  sessionsSearchValue: "",
  userSessions: [],
};

type State = {
  loading: boolean;
  sessionsSearchValue: string;
  userSessions: UserSession[];
};

type Action =
  | { type: typeof SET_USER_SESSIONS_SEARCH_VALUE; payload: string }
  | { type: typeof SET_USER_SESSIONS; payload: ServerUserSession[] }
  | {
      type: typeof CHANGE_USER_SESSION_STATUS;
      payload: { sessionId: string; status: boolean };
    }
  | { type: typeof DELETE_USER_SESSION; payload: string };

type Dispatch = (action: Action) => void;

type UserSessionsContextType = {
  state: State;
  usersSessionDispatch: Dispatch;
  loadUserSessions: () => Promise<void>;
};

const UserSessionsContext = createContext<UserSessionsContextType>({
  state: initialState,
  usersSessionDispatch: () => {},
  loadUserSessions: async () => {},
});

const UserSessionsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, usersSessionDispatch] = useReducer(reducer, initialState);
  const { loadingDispatch } = useContext(LoadingContext);

  useEffect(() => {
    loadUserSessions();
  }, []);

  const loadUserSessions = async () => {
    try {
      loadingDispatch({ type: SET_FULL_PAGE_LOADING, payload: true });
      const response = await getUserSessionsRequest();

      usersSessionDispatch({
        type: SET_USER_SESSIONS,
        payload: response.data,
      });
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to fetch user sessions", "quicktasker"));
    } finally {
      loadingDispatch({ type: SET_FULL_PAGE_LOADING, payload: false });
    }
  };

  return (
    <UserSessionsContext.Provider
      value={{ state, usersSessionDispatch, loadUserSessions }}
    >
      {children}
    </UserSessionsContext.Provider>
  );
};

export {
  UserSessionsContext,
  UserSessionsContextProvider,
  type Action,
  type State,
};
