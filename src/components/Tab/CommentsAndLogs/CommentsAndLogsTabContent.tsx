import { ArrowPathIcon, ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { useTimezone } from "../../../hooks/useTimezone";
import { WPQTComment } from "../../../types/comment";
import { LoadingOval } from "../../Loading/Loading";
import { WPQTIconButton } from "../../common/Button/Button";
import { WPQTTextarea } from "../../common/TextArea/TextArea";

type Props<T> = {
  typeId: string;
  fetchData: () => Promise<T[] | undefined>;
  renderItem: (item: T) => JSX.Element;
  noDataMessage: string;
  onAdd?: (text: string) => Promise<T | undefined>;
  explanation?: string;
  enableAdd?: boolean;
};

function CommentsAndLogsTabContent<T>({
  typeId,
  fetchData,
  renderItem,
  noDataMessage,
  explanation,
  onAdd = async () => undefined,
  enableAdd = false,
}: Props<T>) {
  const [data, setData] = useState<T[] | null>(null);
  const [newEntry, setNewEntry] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [addingEntry, setAddingEntry] = useState(false);

  useEffect(() => {
    loadData();
  }, [typeId]);

  const loadData = async () => {
    setLoadingComments(true);
    const data = await fetchData();
    if (data) {
      setData(data);
    }
    setLoadingComments(false);
  };

  const addEntry = async () => {
    setAddingEntry(true);
    const entry = await onAdd(newEntry);
    if (entry) {
      setData((prevData) => (prevData ? [...prevData, entry] : [entry]));
      setNewEntry("");
    }
    setAddingEntry(false);
  };

  if (data === null) {
    return (
      <div className="wpqt-flex wpqt-justify-center">
        <LoadingOval width="30" height="30" />
      </div>
    );
  }

  return (
    <div>
      {explanation && (
        <div className="wpqt-mb-3 wpqt-text-center wpqt-font-semibold">
          {explanation}
        </div>
      )}
      {data.length === 0 && (
        <div className="wpqt-mb-3 wpqt-text-center">{noDataMessage}</div>
      )}
      {data.length > 0 && (
        <div className="wpqt-mb-[28px] wpqt-mt-[56px] wpqt-logs-grid">
          {data.map((item) => renderItem(item))}
        </div>
      )}
      <div className="wpqt-mb-3 wpqt-flex wpqt-justify-center">
        <CommentsRefresh
          isLoading={loadingComments}
          refreshComemnts={loadData}
        />
      </div>

      {enableAdd && (
        <div className="wpqt-flex wpqt-justify-center">
          <div className="wpqt-w-2/3">
            <WPQTTextarea
              rowsCount={3}
              value={newEntry}
              onChange={(text) => setNewEntry(text)}
              className="wpqt-mb-4 wpqt-w-full"
            />
            <WPQTIconButton
              text="Add comment"
              loading={addingEntry}
              onClick={addEntry}
              className="wpqt-float-right"
              icon={
                <ChatBubbleLeftIcon className="wpqt-icon-blue wpqt-size-5" />
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

type CommentsRefreshProps = {
  isLoading: boolean;
  refreshComemnts: () => void;
};
function CommentsRefresh({ isLoading, refreshComemnts }: CommentsRefreshProps) {
  return (
    <>
      {isLoading ? (
        <LoadingOval width="32" height="32" />
      ) : (
        <ArrowPathIcon
          className="wpqt-icon-blue wpqt-size-8 wpqt-cursor-pointer hover:wpqt-text-qtBlueHover"
          onClick={refreshComemnts}
        />
      )}
    </>
  );
}

function TabContentCommentItem({ item }: { item: WPQTComment }) {
  const { convertToWPTimezone } = useTimezone();

  return (
    <>
      <div>
        <div className="wpqt-text-center wpqt-mb-1">{item.author_name}</div>
        <div className="wpqt-text-center">
          {item.is_admin_comment
            ? __("Admin", "quicktasker")
            : __("QuickTasker", "quicktasker")}
        </div>
      </div>
      <div>{item.text}</div>
      <div>{convertToWPTimezone(item.created_at)}</div>
    </>
  );
}

export { CommentsAndLogsTabContent, TabContentCommentItem };
