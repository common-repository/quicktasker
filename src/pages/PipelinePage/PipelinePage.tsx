import { AddPipelineModal } from "../../components/Modal/PipelineModal/AddPipelineModal/AddPipelineModal";
import { EditPipelineModal } from "../../components/Modal/PipelineModal/EditPipelineModal/EditPipelineModal";
import { ActivePipelineContextProvider } from "../../providers/ActivePipelineContextProvider";
import { Page } from "../Page/Page";
import Pipeline from "./components/Pipeline";
import { PipelineHeader } from "./components/PipelineHeader/PipelineHeader";

const PipelinePage = () => {
  return (
    <ActivePipelineContextProvider>
      <Page>
        <PipelineHeader />
        <Pipeline />
        <AddPipelineModal />
        <EditPipelineModal />
      </Page>
    </ActivePipelineContextProvider>
  );
};
export { PipelinePage };
