import { CustomField } from "../../types/custom-field";
import { ServerUser } from "../../types/user";

type UserPageUserResponse = {
  user: ServerUser;
  customFields: CustomField[];
};

export type { UserPageUserResponse };
