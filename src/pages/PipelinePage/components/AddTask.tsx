import { PlusCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useContext, useEffect, useRef, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { createTaskRequest } from "../../../api/api";
import { WPQTInput } from "../../../components/common/Input/Input";
import { LoadingOval } from "../../../components/Loading/Loading";
import { PIPELINE_ADD_TASK } from "../../../constants";
import { ActivePipelineContext } from "../../../providers/ActivePipelineContextProvider";

type Props = {
  stageId: string;
};

function AddTask({ stageId }: Props) {
  const [taskName, setTaskName] = useState("");
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const componentRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    state: { activePipeline },
    dispatch,
  } = useContext(ActivePipelineContext);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        document.activeElement === inputRef.current
      ) {
        createTask();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [taskName]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        componentRef.current &&
        !componentRef.current.contains(event.target as Node)
      ) {
        clearState();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (showTaskInput) {
      inputRef.current?.focus();
    }
  }, [showTaskInput]);

  const createTask = async () => {
    if (!taskName) {
      toast.error(__("Task name is required", "quicktasker"));
      return;
    }
    try {
      setLoading(true);
      const response = await createTaskRequest(
        stageId,
        activePipeline!.id,
        taskName,
      );
      dispatch({
        type: PIPELINE_ADD_TASK,
        payload: response.data,
      });
      clearState();
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to create task", "quicktasker"));
    } finally {
      setLoading(false);
    }
  };

  const clearState = () => {
    setShowTaskInput(false);
    setTaskName("");
  };

  return (
    <div
      ref={componentRef}
      className="wpqt-sticky wpqt-bottom-0 wpqt-z-10 wpqt-order-1 wpqt-mt-2 wpqt-flex wpqt-justify-center wpqt-bg-gray-100 wpqt-py-2"
    >
      {showTaskInput ? (
        <div className="wpqt-flex wpqt-items-center wpqt-gap-3">
          <WPQTInput
            ref={inputRef}
            value={taskName}
            onChange={(value) => setTaskName(value)}
            wrapperClassName="!wpqt-mb-0"
            className="!wpqt-mb-0"
          />
          {loading ? (
            <LoadingOval width="24" height="24" />
          ) : (
            <>
              <XCircleIcon
                className="wpqt-icon-red wpqt-size-6 wpqt-cursor-pointer"
                onClick={clearState}
              />
              <PlusCircleIcon
                className="wpqt-icon-green wpqt-size-6 wpqt-cursor-pointer"
                onClick={createTask}
              />
            </>
          )}
        </div>
      ) : (
        <div
          onClick={() => setShowTaskInput(true)}
          className="wpqt-main-border wpqt-flex wpqt-cursor-pointer wpqt-items-center wpqt-justify-center wpqt-gap-2 wpqt-p-2 hover:wpqt-bg-white"
        >
          {__("Add task", "quicktasker")}
          <PlusCircleIcon className="wpqt-size-6 wpqt-text-green-600" />
        </div>
      )}
    </div>
  );
}

export { AddTask };
