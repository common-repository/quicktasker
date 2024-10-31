import { ServerUserSession, UserSession } from "../types/user-session";

const convertUserSessionFromServer = (
  user: ServerUserSession,
): UserSession => ({
  ...user,
  is_active: user.is_active === "1",
});

export { convertUserSessionFromServer };
