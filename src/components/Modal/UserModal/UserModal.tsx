import { useContext } from "@wordpress/element";
import { CLOSE_USER_MODAL, EDIT_USER } from "../../../constants";
import { useUserActions } from "../../../hooks/actions/useUserActions";
import { DispatchType, useModal } from "../../../hooks/useModal";
import { ModalContext } from "../../../providers/ModalContextProvider";
import { User } from "../../../types/user";
import { WPQTModal } from "../WPQTModal";
import { UserModalContent } from "./UserModalContent";

function UserModal() {
  const {
    state: { userModalOpen },
  } = useContext(ModalContext);
  const {
    modalSaving,
    setModalSaving,
    modalContentRef,
    closeModal,
    handleSuccess,
  } = useModal(CLOSE_USER_MODAL);
  const { editUser } = useUserActions();

  const onEditUser = async (user: User) => {
    setModalSaving(true);
    await editUser(user, (userData) => {
      handleSuccess(EDIT_USER, userData, DispatchType.USER);
    });
    setModalSaving(false);
  };

  return (
    <WPQTModal modalOpen={userModalOpen} closeModal={closeModal} size="xl">
      <UserModalContent
        ref={modalContentRef}
        modalSaving={modalSaving}
        editUser={onEditUser}
      />
    </WPQTModal>
  );
}

export { UserModal };
