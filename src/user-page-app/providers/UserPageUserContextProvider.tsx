import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { CustomField } from "../../types/custom-field";
import { User } from "../../types/user";
import { getUserPageUserDataRequest } from "../api/user-page-api";
import {
  SET_USER_PAGE_USER_DATA,
  SET_USER_PAGE_USER_LOADING,
} from "../constants";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { reducer } from "../reducers/user-page-user-recuder";
import { UserPageUserResponse } from "../types/user-page-user-response";
import { UserPageAppContext } from "./UserPageAppContextProvider";

const initialState: State = {
  user: null,
  customFields: [],
  loading: true,
};

type State = {
  user: User | null;
  customFields: CustomField[];
  loading: boolean;
};

type Action =
  | { type: typeof SET_USER_PAGE_USER_LOADING; payload: boolean }
  | { type: typeof SET_USER_PAGE_USER_DATA; payload: UserPageUserResponse };

type Dispatch = (action: Action) => void;

type UserPageUserContextType = {
  state: State;
  useUserPageUserDispatch: Dispatch;
  loadUserData: () => void;
};

const UserPageUserContext = createContext<UserPageUserContextType>({
  state: initialState,
  useUserPageUserDispatch: () => {},
  loadUserData: () => {},
});

const UserPageUserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, useUserPageUserDispatch] = useReducer<
    React.Reducer<State, Action>
  >(reducer, initialState);
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();

  useEffect(() => {
    if (pageHash) {
      loadUserData();
    }
  }, []);

  const loadUserData = async () => {
    try {
      useUserPageUserDispatch({
        type: SET_USER_PAGE_USER_LOADING,
        payload: true,
      });
      const response = await getUserPageUserDataRequest(pageHash);
      useUserPageUserDispatch({
        type: SET_USER_PAGE_USER_DATA,
        payload: response.data,
      });
    } catch (error) {
      handleError(error);
    } finally {
      useUserPageUserDispatch({
        type: SET_USER_PAGE_USER_LOADING,
        payload: false,
      });
    }
  };

  return (
    <UserPageUserContext.Provider
      value={{ state, useUserPageUserDispatch, loadUserData }}
    >
      {children}
    </UserPageUserContext.Provider>
  );
};

export {
  UserPageUserContext,
  UserPageUserContextProvider,
  type Action,
  type State,
};
