import { createContext, useEffect, useReducer } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { getUsersRequest } from "../api/api";
import {
  ADD_USER,
  CHANGE_USER_STATUS,
  DELETE_USER,
  EDIT_USER,
  RESET_PASSWORD,
  SET_USERS,
  SET_USERS_SEARCH_VALUE,
} from "../constants";
import { reducer } from "../reducers/user-reducer";
import { ServerUser, User } from "../types/user";

const initialState: State = {
  users: [],
  usersSearchValue: "",
};

type State = {
  users: User[];
  usersSearchValue: string;
};

type Action =
  | { type: typeof SET_USERS; payload: ServerUser[] }
  | { type: typeof ADD_USER; payload: ServerUser }
  | { type: typeof EDIT_USER; payload: ServerUser }
  | {
      type: typeof CHANGE_USER_STATUS;
      payload: { isActive: boolean; userId: string };
    }
  | { type: typeof RESET_PASSWORD; payload: string }
  | { type: typeof DELETE_USER; payload: string }
  | { type: typeof SET_USERS_SEARCH_VALUE; payload: string };

type Dispatch = (action: Action) => void;

type UserContextType = {
  state: State;
  userDispatch: Dispatch;
  updateUsers: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
  state: initialState,
  userDispatch: () => {},
  updateUsers: async () => {},
});

const UserContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, userDispatch] = useReducer<React.Reducer<State, Action>>(
    reducer,
    initialState,
  );

  useEffect(() => {
    const initialUsers = window.wpqt.initialUsers;

    userDispatch({ type: SET_USERS, payload: initialUsers });
  }, []);

  const updateUsers = async () => {
    try {
      const response = await getUsersRequest();
      userDispatch({ type: SET_USERS, payload: response.data });
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to fetch users", "quicktasker"));
    }
  };

  return (
    <UserContext.Provider value={{ state, userDispatch, updateUsers }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider, type Action, type State };
