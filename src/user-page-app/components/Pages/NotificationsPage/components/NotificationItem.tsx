import { useNavigate } from "react-router-dom";
import { WPQTCard } from "../../../../../components/Card/Card";
import { NotificationItemType } from "../NotificationsPage";

type Props = {
  notification: NotificationItemType;
};

function NotificationItem({ notification }: Props) {
  const navigate = useNavigate();

  const onClick = () => {
    if (notification.type === "task") {
      navigate(`/tasks/${notification.subjectHash}/comments`);
    } else {
      navigate(`/user/comments`);
    }
  };

  return (
    <WPQTCard
      title={notification.subjectName}
      onClick={onClick}
      className="wpqt-cursor-pointer"
    >
      <div>{notification.numberOfComments} new comments</div>
    </WPQTCard>
  );
}

export { NotificationItem };
