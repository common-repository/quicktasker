type BaseComment = {
  id: string;
  text: string;
  type: "task" | "user";
  type_id: string;
  author_id: string;
  author_name: string;
  created_at: string;
  subject_name?: string;
  subject_hash?: string;
};

type WPQTComment = BaseComment & {
  is_admin_comment: boolean;
};
type WPQTCommentFromServer = BaseComment & {
  is_admin_comment: string;
};

export type { WPQTComment, WPQTCommentFromServer };
