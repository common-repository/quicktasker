import {
  createContext,
  useContext,
  useEffect,
  useReducer,
} from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { WPQTComment } from "../../types/comment";
import {
  convertCommentFromServer,
  filterNewComments,
} from "../../utils/comment";
import { getUserPageCommentsRequest } from "../api/user-page-api";
import {
  CHANGE_USER_PAGE_NOTIFICATIONS_LOADING,
  CHECK_NEW_COMMENTS_INTERVAL,
  SESSION_EXPIRE_NOTIFICATION_TRESHOLD,
  SESSION_NOTIFICATION_CHECK_INTERVAL,
  SET_USER_PAGE_NOTIFICATIONS_NEW_COMMENTS,
} from "../constants";
import { useErrorHandler } from "../hooks/useErrorHandler";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useSession } from "../hooks/useSession";
import { reducer } from "../reducers/user-page-notifications-reducer";
import { UserPageAppContext } from "./UserPageAppContextProvider";

const initialState: State = {
  newComments: [],
  loading: true,
};

type State = {
  newComments: WPQTComment[];
  loading: boolean;
};

type Action =
  | {
      type: typeof SET_USER_PAGE_NOTIFICATIONS_NEW_COMMENTS;
      payload: WPQTComment[];
    }
  | { type: typeof CHANGE_USER_PAGE_NOTIFICATIONS_LOADING; payload: boolean };

type Dispatch = (action: Action) => void;

type UserPageNotificationsContextType = {
  state: State;
  userPageNotificationsDispatch: Dispatch;
  checkNewComments: () => Promise<void>;
};

const UserPageNotificationsContext =
  createContext<UserPageNotificationsContextType>({
    state: initialState,
    userPageNotificationsDispatch: () => {},
    checkNewComments: async () => {},
  });

const UserPageNotificationsContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, userPageNotificationsDispatch] = useReducer<
    React.Reducer<State, Action>
  >(reducer, initialState);
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();
  const { getStoredComments } = useLocalStorage();
  const { isLoggedIn, getSessionTimeLeft } = useSession();

  useEffect(() => {
    const interval = setInterval(() => {
      checkNewComments();
    }, CHECK_NEW_COMMENTS_INTERVAL);
    checkNewComments();

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      sessionExpireTimeCheck();
    }, SESSION_NOTIFICATION_CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const setLoading = (loading: boolean) => {
    userPageNotificationsDispatch({
      type: CHANGE_USER_PAGE_NOTIFICATIONS_LOADING,
      payload: loading,
    });
  };

  const sessionExpireTimeCheck = () => {
    if (!isLoggedIn()) {
      return;
    }

    const timeLeft = getSessionTimeLeft(pageHash);

    if (timeLeft && timeLeft <= SESSION_EXPIRE_NOTIFICATION_TRESHOLD) {
      toast.info(
        sprintf(
          __("Your session is about to expire in %s minutes", "quicktasker"),
          timeLeft,
        ),
      );
    }
  };

  const checkNewComments = async () => {
    if (!isLoggedIn()) {
      return;
    }
    try {
      setLoading(true);
      const storedComments = await getStoredComments();
      const response = await getUserPageCommentsRequest(pageHash);
      const comments = response.data.map(convertCommentFromServer);
      const newComments = filterNewComments(comments, storedComments);

      userPageNotificationsDispatch({
        type: SET_USER_PAGE_NOTIFICATIONS_NEW_COMMENTS,
        payload: newComments,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserPageNotificationsContext.Provider
      value={{ state, userPageNotificationsDispatch, checkNewComments }}
    >
      {children}
    </UserPageNotificationsContext.Provider>
  );
};

export {
  UserPageNotificationsContext,
  UserPageNotificationsContextProvider,
  type Action,
  type State,
};
