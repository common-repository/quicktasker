import { useContext, useEffect } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { UserPageNotificationsContext } from "../../../providers/UserPageNotificationsContextProvider";
import { PageContentWrap, PageWrap } from "../Page/Page";
import { NotificationItem } from "./components/NotificationItem";

type NotificationItemType = {
  typeId: string;
  type: "task" | "user";
  numberOfComments: number;
  subjectName: string;
  subjectHash: string;
};

type GroupedComments = {
  [key: string]: NotificationItemType;
};

function NotificationsPage() {
  const {
    state: { newComments, loading },
    checkNewComments,
  } = useContext(UserPageNotificationsContext);
  useEffect(() => {
    checkNewComments();
  }, []);

  const groupedComments = newComments.reduce<GroupedComments>(
    (acc, comment) => {
      const key = `${comment.type_id}-${comment.type}`;
      if (!acc[key]) {
        acc[key] = {
          typeId: comment.type_id,
          type: comment.type,
          numberOfComments: 0,
          subjectName: comment.subject_name || "",
          subjectHash: comment.subject_hash || "",
        };
      }
      acc[key].numberOfComments += 1;
      return acc;
    },
    {},
  );

  return (
    <PageWrap loading={loading} onRefresh={checkNewComments}>
      <PageContentWrap>
        <p className="wpqt-text-center">
          {sprintf(
            __("You have %d new %s", "quicktasker"),
            newComments.length,
            newComments.length === 1
              ? __("comment", "quicktasker")
              : __("comments", "quicktasker"),
          )}
        </p>
        <div className="wpqt-grid wpqt-grid-cols-1  sm:wpqt-grid-cols-2 wpqt-gap-2 lg:wpqt-grid-cols-4">
          {Object.values(groupedComments).map((notification) => (
            <NotificationItem
              key={notification.typeId}
              notification={notification}
            />
          ))}
        </div>
      </PageContentWrap>
    </PageWrap>
  );
}

export { NotificationsPage, type GroupedComments, type NotificationItemType };
