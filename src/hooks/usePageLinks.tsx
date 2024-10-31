import { useContext } from "@wordpress/element";
import { AppContext } from "../providers/AppContextProvider";

function usePageLinks() {
  const {
    state: { siteURL, publicUserPageId },
  } = useContext(AppContext);
  const userPage = siteURL + `/wpqt?page=${publicUserPageId}&page_id=wpqt`;

  return {
    userPage,
  };
}

export { usePageLinks };
