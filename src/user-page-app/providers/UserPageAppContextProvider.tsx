import { createContext, useEffect, useReducer } from "@wordpress/element";
import { getQueryParam } from "../../utils/url";
import { getUserPageStatusRequest } from "../api/user-page-api";
import {
  SET_INIT_DATA,
  SET_USER_LOGGED_IN,
  SET_USER_PAGE_STATUS,
} from "../constants";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useSession } from "../hooks/useSession";
import { reducer } from "../reducers/user-page-app-reducer";

const initialState: State = {
  initialLoading: true,
  isActiveUser: false,
  setupCompleted: false,
  isLoggedIn: false,
  pageHash: getQueryParam("code") || "",
  userId: "",
  userName: "",
  cf: false,
  timezone: "",
};

type State = {
  initialLoading: boolean;
  isActiveUser: boolean;
  setupCompleted: boolean;
  isLoggedIn: boolean;
  pageHash: string;
  userId: string;
  userName: string;
  cf: boolean;
  timezone: string;
};

type Action =
  | {
      type: typeof SET_USER_PAGE_STATUS;
      payload: {
        isActiveUser: string;
        isLoggedIn: boolean;
        setupCompleted: boolean;
        userId: string;
        userName: string;
      };
    }
  | { type: typeof SET_INIT_DATA; payload: { timezone: string } }
  | { type: typeof SET_USER_LOGGED_IN; payload: boolean };

type Dispatch = (action: Action) => void;

type UserPageAppContextType = {
  state: State;
  userPageAppDispatch: Dispatch;
  loadUserPageStatus: () => void;
};

const UserPageAppContext = createContext<UserPageAppContextType>({
  state: initialState,
  userPageAppDispatch: () => {},
  loadUserPageStatus: () => {},
});

const UserPageAppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, userPageAppDispatch] = useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );
  const { isLoggedIn } = useSession();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const timezone = window.wpqt_user.timezone;

    userPageAppDispatch({
      type: SET_INIT_DATA,
      payload: { timezone },
    });
  }, []);

  useEffect(() => {
    loadUserPageStatus();
  }, []);

  const loadUserPageStatus = async () => {
    try {
      const pageHash = state.pageHash;

      if (pageHash) {
        const userLoggedIn = isLoggedIn();
        const { data } = await getUserPageStatusRequest(pageHash);

        userPageAppDispatch({
          type: SET_USER_PAGE_STATUS,
          payload: { ...data, isLoggedIn: userLoggedIn },
        });
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <UserPageAppContext.Provider
      value={{ state, userPageAppDispatch, loadUserPageStatus }}
    >
      {children}
    </UserPageAppContext.Provider>
  );
};

export {
  UserPageAppContext,
  UserPageAppContextProvider,
  type Action,
  type State,
};
