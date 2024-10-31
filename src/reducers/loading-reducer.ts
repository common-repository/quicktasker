import { SET_FULL_PAGE_LOADING } from "../constants";
import { Action, State } from "../providers/LoadingContextProvider";

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_FULL_PAGE_LOADING: {
      const fullPageLoading: boolean = action.payload;

      return { ...state, fullPageLoading };
    }
    default: {
      return state;
    }
  }
};

export { reducer };
