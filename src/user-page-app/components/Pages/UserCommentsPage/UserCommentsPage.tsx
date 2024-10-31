import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { WPQTComment } from "../../../../types/comment";
import { useCommentActions } from "../../../hooks/actions/useCommentActions";
import { CommentsApp } from "../../CommentsApp/CommentsApp";
import { PageContentWrap, PageTitle, PageWrap } from "../Page/Page";

function UserCommentsPage() {
  const [userComments, setUserComments] = useState<WPQTComment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const { loadUserComments, addUserComment } = useCommentActions();

  useEffect(() => {
    getUserComments();
  }, []);

  const getUserComments = async () => {
    setLoading(true);
    await loadUserComments((comments) => {
      setUserComments(comments);
    });
    setLoading(false);
  };
  const onAddUserComment = async (comment: string) => {
    await addUserComment(comment, (comments) => {
      setUserComments(comments);
    });
  };

  return (
    <PageWrap loading={loading} onRefresh={getUserComments}>
      <PageContentWrap>
        <PageTitle
          description={__("Comments related to your user", "quicktasker")}
        >
          {__("User comments", "quicktasker")}
        </PageTitle>
        {userComments && (
          <CommentsApp comments={userComments} addComments={onAddUserComment} />
        )}
      </PageContentWrap>
    </PageWrap>
  );
}

export { UserCommentsPage };
