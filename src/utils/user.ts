import {
  ExtendedUser,
  ServerExtendedUser,
  ServerUser,
  User,
} from "../types/user";

const convertUserFromServer = (user: ServerUser): User => ({
  ...user,
  is_active: user.is_active === "1",
  has_password: user.has_password === "1",
});

const convertExtendedUserFromServer = (
  user: ServerExtendedUser,
): ExtendedUser => ({
  ...user,
  is_active: user.is_active === "1",
});

export { convertExtendedUserFromServer, convertUserFromServer };
