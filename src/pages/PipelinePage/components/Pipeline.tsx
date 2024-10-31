import {
  DragDropContext,
  DraggableLocation,
  DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useContext, useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import { moveTaskRequest } from "../../../api/api";
import { StageModal } from "../../../components/Modal/StageModal/StageModal";
import { TaskModal } from "../../../components/Modal/TaskModal/TaskModal";
import { REFETCH_ACTIVE_PIPELINE_INTERVAL } from "../../../constants";
import { ActivePipelineContext } from "../../../providers/ActivePipelineContextProvider";
import { Pipeline } from "../../../types/pipeline";
import { AddStage } from "./AddStage";
import { PipelineIntro } from "./PipelineIntro";
import { Stage } from "./Stage";

const Pipeline = () => {
  const {
    state: { activePipeline },
    dispatch,
    fetchAndSetPipelineData,
  } = useContext(ActivePipelineContext);

  useEffect(() => {
    const refetchDataInterval = setInterval(() => {
      if (activePipeline) {
        fetchAndSetPipelineData(activePipeline.id);
      }
    }, REFETCH_ACTIVE_PIPELINE_INTERVAL);

    return () => clearInterval(refetchDataInterval);
  }, [activePipeline]);

  const dispatchMove = (
    source: DraggableLocation,
    destination: DraggableLocation,
  ) => {
    if (source.droppableId === destination.droppableId) {
      dispatch({
        type: "REORDER_TASK",
        payload: {
          source,
          destination,
        },
      });
    } else {
      dispatch({
        type: "MOVE_TASK",
        payload: {
          source,
          destination,
        },
      });
    }
  };

  const onDragEnd = useCallback(
    async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination) {
        return;
      }

      dispatchMove(source, destination);

      try {
        await moveTaskRequest(
          draggableId,
          destination.droppableId,
          destination.index,
        );
      } catch (error) {
        console.error(error);
        dispatchMove(destination, source);
        toast.error(__("Failed to move a task", "quicktasker"));
      }
    },
    [activePipeline],
  );

  const deleteTaskCallback = () => {
    if (activePipeline) {
      fetchAndSetPipelineData(activePipeline.id);
    }
  };

  if (!activePipeline) {
    return <PipelineIntro />;
  }

  return (
    <div className="wpqt-pipeline-height wpqt-flex wpqt-gap-[24px] wpqt-overflow-x-auto wpqt-overflow-y-hidden">
      <DragDropContext onDragEnd={onDragEnd}>
        {activePipeline!.stages?.map((stage) => {
          return <Stage key={stage.id} stage={stage} />;
        })}
      </DragDropContext>
      <AddStage
        pipelineId={activePipeline.id}
        stagesLength={activePipeline!.stages?.length}
      />
      <TaskModal deleteTaskCallback={deleteTaskCallback} />
      <StageModal />
    </div>
  );
};
export default Pipeline;
