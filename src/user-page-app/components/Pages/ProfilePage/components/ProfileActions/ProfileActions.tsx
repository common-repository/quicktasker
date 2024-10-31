import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { WPQTIconButton } from "../../../../../../components/common/Button/Button";

function ProfileActions() {
  const navigate = useNavigate();

  return (
    <div className="wpqt-mt-4 wpqt-flex wpqt-gap-3">
      <WPQTIconButton
        icon={<ChatBubbleLeftIcon className="wpqt-icon-blue wpqt-size-5" />}
        text={__("Manage user comments", "quicktasker")}
        onClick={() => {
          navigate(`/user/comments`);
        }}
      />
    </div>
  );
}

export { ProfileActions };
