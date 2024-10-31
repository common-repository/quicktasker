type BaseUserPageStatus = {
  isLoggedIn: boolean;
  userId: string;
  userName: string;
};

type UserPageStatus = BaseUserPageStatus & {
  isActiveUser: boolean;
  setupCompleted: boolean;
};

type ServerUserPageStatus = BaseUserPageStatus & {
  isActiveUser: string;
  setupCompleted: boolean;
};

export type { ServerUserPageStatus, UserPageStatus };
