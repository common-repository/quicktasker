import { EyeIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useNavigate } from "react-router-dom";
import { WPQTIconButton } from "../../../../components/common/Button/Button";
import { getOverviewRequest } from "../../../api/user-page-api";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { UserPageAppContext } from "../../../providers/UserPageAppContextProvider";
import { UserPageOverview } from "../../../types/user-page-overview";
import { PageContentWrap, PageWrap } from "../Page/Page";

function HomePage() {
  const {
    state: { pageHash },
  } = useContext(UserPageAppContext);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<null | UserPageOverview>(null);
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    getOverviewData();
  }, []);

  const getOverviewData = async () => {
    try {
      setLoading(true);
      const response = await getOverviewRequest(pageHash);

      setOverview(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap
      loading={loading}
      onRefresh={getOverviewData}
      className="wpqt-flex wpqt-items-center wpqt-justify-center"
    >
      <PageContentWrap>
        <div className="wpqt-flex wpqt-flex-col wpqt-items-center wpqt-justify-center wpqt-gap-2">
          <div>
            {__("Assigned tasks:", "quicktasker")}{" "}
            {overview?.assignedTasksCount}
          </div>
          <WPQTIconButton
            icon={<EyeIcon className="wpqt-size-5 wpqt-icon-blue" />}
            text={__("View assigned tasks", "quicktasker")}
            className="wpqt-mb-5"
            onClick={() => navigate("/user-tasks")}
          />
          <div>
            {__("Assignable tasks:", "quicktasker")}{" "}
            {overview?.assignableTaskCount}
          </div>
          <WPQTIconButton
            icon={<EyeIcon className="wpqt-size-5 wpqt-icon-green" />}
            text={__("View assignable tasks", "quicktasker")}
            onClick={() => navigate("/assignable-tasks")}
          />
        </div>
      </PageContentWrap>
    </PageWrap>
  );
}

export { HomePage };
