import { useContext, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { useParams } from "react-router-dom";
import { WPQTComment } from "../../../../types/comment";
import { Task } from "../../../../types/task";
import { convertCommentFromServer } from "../../../../utils/comment";
import { convertTaskFromServer } from "../../../../utils/task";
import { useCommentActions } from "../../../hooks/actions/useCommentActions";
import { useTaskActions } from "../../../hooks/actions/useTaskActions";
import { UserPageAppContext } from "../../../providers/UserPageAppContextProvider";
import { UserPageTaskResponse } from "../../../types/user-page-task-response";
import { CommentsApp } from "../../CommentsApp/CommentsApp";
import { PageContentWrap, PageTitle, PageWrap } from "../Page/Page";

function TaskCommentsPage() {
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);

  const { taskHash } = useParams<{ taskHash: string }>();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<WPQTComment[] | null>(null);
  const { loadTaskComments, addTaskComment } = useCommentActions();
  const { getTask } = useTaskActions();

  useEffect(() => {
    loadTask();
    loadComments();
  }, []);

  const loadTask = async () => {
    await getTask(pageHash, taskHash!, (data: UserPageTaskResponse) => {
      setTask(convertTaskFromServer(data.task));
    });
  };
  const loadComments = async () => {
    setLoading(true);
    await loadTaskComments(pageHash, taskHash!, (comments) => {
      setComments(comments.map(convertCommentFromServer));
    });
    setLoading(false);
  };
  const onAddComment = async (comment: string) => {
    await addTaskComment(task!.task_hash, comment, (comments) => {
      setComments(comments);
    });
  };

  return (
    <PageWrap loading={loading} onRefresh={loadComments}>
      <PageContentWrap>
        {task && (
          <PageTitle
            description={__("Comments related to the task", "quicktasker")}
          >
            {sprintf(__("%s comments", "quicktasker"), task.name)}
          </PageTitle>
        )}
        {comments && (
          <CommentsApp comments={comments} addComments={onAddComment} />
        )}
      </PageContentWrap>
    </PageWrap>
  );
}

export { TaskCommentsPage };
