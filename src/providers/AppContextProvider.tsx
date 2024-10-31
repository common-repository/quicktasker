import { createContext, useEffect, useReducer } from "@wordpress/element";
import { INIT_APP_STATE, SET_SITE_URL } from "../constants";
import { reducer } from "../reducers/app-reducer";

type State = {
  siteURL: string;
  publicUserPageId: string;
  is_customFields: boolean;
  timezone: string;
  isUserAllowedToDelete: boolean;
};

const initialState: State = {
  siteURL: "",
  publicUserPageId: "",
  is_customFields: false,
  timezone: "",
  isUserAllowedToDelete: false,
};

type Action =
  | {
      type: typeof INIT_APP_STATE;
      payload: {
        siteURL: string;
        publicUserPageId: string;
        timezone: string;
        isUserAllowedToDelete: boolean;
      };
    }
  | { type: typeof SET_SITE_URL; payload: string };

type Dispatch = (action: Action) => void;

type AppContextType = {
  state: State;
  appDispatch: Dispatch;
};

const AppContext = createContext<AppContextType>({
  state: initialState,
  appDispatch: () => {},
});

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, appDispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const siteURL = window.wpqt.siteURL;
    const publicUserPageId = window.wpqt.publicUserPageId;
    const timezone = window.wpqt.timezone;
    const isUserAllowedToDelete = window.wpqt.isUserAllowedToDelete === "1";

    appDispatch({
      type: INIT_APP_STATE,
      payload: {
        siteURL,
        publicUserPageId,
        timezone,
        isUserAllowedToDelete,
      },
    });
  }, []);

  return (
    <AppContext.Provider value={{ state, appDispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider, type Action, type State };
