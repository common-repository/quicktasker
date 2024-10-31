import { useContext } from "@wordpress/element";
import { CHANGE_USER_SETTINGS_MODAL_OPEN } from "../../../constants";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { CustomFieldEntityType } from "../../../types/custom-field";
import { CustomFieldsInModalWrap } from "../../CustomField/CustomFieldsInModalWrap/CustomFieldsInModalWrap";
import { WPQTModal } from "../WPQTModal";
function UsersSettingsModal() {
  const {
    state: { userSettingsModalOpen },
    modalDispatch,
  } = useContext(ModalContext);

  return (
    <WPQTModal
      modalOpen={userSettingsModalOpen}
      closeModal={() =>
        modalDispatch({ type: CHANGE_USER_SETTINGS_MODAL_OPEN, payload: false })
      }
      size="lg"
    >
      <div>
        <CustomFieldsInModalWrap
          entityId="null"
          entityType={CustomFieldEntityType.Users}
        />
      </div>
    </WPQTModal>
  );
}

export { UsersSettingsModal };
