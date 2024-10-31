import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { WP_QUICKTASKER_INVALID_SESSION_TOKEN } from "../../constants";
import { UserPageAppContext } from "../providers/UserPageAppContextProvider";
import { useSession } from "./useSession";

function useErrorHandler() {
  const { loadUserPageStatus } = useContext(UserPageAppContext);
  const { deleteSessionCookie } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = async (error: any) => {
    console.error(error);

    if (
      error.messages &&
      Array.isArray(error.messages) &&
      error.messages.length > 0
    ) {
      const errorMessage = error.messages.join(", ");
      const hasInvalidTokenError = errorMessage.includes(
        WP_QUICKTASKER_INVALID_SESSION_TOKEN,
      );
      if (hasInvalidTokenError) {
        toast.info(
          __(
            "Your session has expired. Please log in to continue.",
            "quicktasker",
          ),
        );
        await deleteSessionCookie();
        loadUserPageStatus();
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return {
    handleError,
  };
}

export { useErrorHandler };
