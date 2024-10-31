import { useContext } from "@wordpress/element";
import Cookies from "js-cookie";
import { UserPageAppContext } from "../providers/UserPageAppContextProvider";
import { UserSession } from "../types/user-session";

function useSession() {
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);

  /**
   * Sets the session cookie and stores the session expiration in local storage.
   *
   * @param {UserSession} session - The user session object containing session details.
   * @returns {Promise<void>} A promise that resolves when the session cookie and expiration are set.
   */
  const setSessionCookie = async (session: UserSession) => {
    const expireDate = new Date(`${session.expiresAtUTC}Z`);

    localStorage.setItem(
      `wpqt-session-expiration-${pageHash}`,
      expireDate.toISOString(),
    );

    Cookies.set(`wpqt-session-token-${pageHash}`, session.sessionToken, {
      expires: expireDate,
      path: "/",
      sameSite: "strict",
    });
  };

  const getSessionCookieValue = (): string | undefined => {
    return Cookies.get(`wpqt-session-token-${pageHash}`);
  };

  const isLoggedIn = (): boolean => {
    return !!Cookies.get(`wpqt-session-token-${pageHash}`);
  };

  /**
   * Deletes the session cookie and removes the session expiration from local storage.
   *
   * This function removes the session expiration associated with the given page hash
   * from the local storage and deletes the session token cookie.
   *
   * @async
   * @function deleteSessionCookie
   * @returns {Promise<void>} A promise that resolves when the session cookie and local storage item are removed.
   */
  const deleteSessionCookie = async () => {
    localStorage.removeItem(`wpqt-session-expiration-${pageHash}`);
    Cookies.remove(`wpqt-session-token-${pageHash}`);
  };

  /**
   * Retrieves the remaining session time for a given page hash.
   *
   * @param {string} pageHash - The unique identifier for the user page.
   * @returns {number | null} - The time left in minutes, or null if no expiration is found.
   */
  const getSessionTimeLeft = (pageHash: string) => {
    const expirationString = localStorage.getItem(
      `wpqt-session-expiration-${pageHash}`,
    );
    if (!expirationString) {
      return null;
    }

    const expirationDate = new Date(expirationString);
    const timeLeft = expirationDate.getTime() - new Date().getTime();

    // Convert milliseconds to minutes
    return timeLeft > 0 ? Math.floor(timeLeft / 1000 / 60) : 0;
  };

  return {
    setSessionCookie,
    getSessionCookieValue,
    isLoggedIn,
    deleteSessionCookie,
    getSessionTimeLeft,
  };
}

export { useSession };
