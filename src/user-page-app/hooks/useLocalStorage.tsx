import { useContext } from "@wordpress/element";
import { WPQTComment } from "../../types/comment";
import { filterNewComments } from "../../utils/comment";
import { UserPageAppContext } from "../providers/UserPageAppContextProvider";

const WPQT_STORED_COMMENTS_KEY = "wpqt-stored-comments";

function useLocalStorage() {
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);

  const getStoredComments = async (): Promise<WPQTComment[]> => {
    const storedComments = localStorage.getItem(
      `${WPQT_STORED_COMMENTS_KEY}-${pageHash}`,
    );

    return storedComments ? JSON.parse(storedComments) : [];
  };

  const storeComments = async (comments: WPQTComment[]) => {
    const storedComments = await getStoredComments();
    const newComments = filterNewComments(comments, storedComments);
    const updatedComments = [...storedComments, ...newComments];

    localStorage.setItem(
      `${WPQT_STORED_COMMENTS_KEY}-${pageHash}`,
      JSON.stringify(updatedComments),
    );
  };

  return { getStoredComments, storeComments };
}

export { useLocalStorage };
