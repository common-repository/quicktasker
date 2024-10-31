import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import {
  assignTaskToUserRequest,
  removeTaskFromUserRequest,
} from "../../../api/api";
import {
  PIPELINE_ADD_USER_TO_TASK,
  PIPELINE_REMOVE_USER_FROM_TASK,
} from "../../../constants";
import { ActivePipelineContext } from "../../../providers/ActivePipelineContextProvider";
import { UserContext } from "../../../providers/UserContextProvider";
import { Task } from "../../../types/task";
import { User } from "../../../types/user";
import { LoadingOval } from "../../Loading/Loading";

type Props = {
  task: Task;
  onUserAdd: (user: User) => void;
  onUserDelete: (user: User) => void;
};

function UserAssignementSelection({ task, onUserAdd, onUserDelete }: Props) {
  const {
    state: { users },
  } = useContext(UserContext);
  const { dispatch } = useContext(ActivePipelineContext);
  const [loading, setLoading] = useState(false);

  const availableUsers = users.filter(
    (user: User) =>
      !(task.assigned_users ?? []).some(
        (assignedUser: User) => assignedUser.id === user.id,
      ),
  );

  const assignUser = async (user: User) => {
    try {
      setLoading(true);
      await assignTaskToUserRequest(user.id, task.id);

      dispatch({
        type: PIPELINE_ADD_USER_TO_TASK,
        payload: {
          taskId: task.id,
          user,
        },
      });
      onUserAdd(user);
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to assign user", "quicktasker"));
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (user: User) => {
    try {
      setLoading(true);
      await removeTaskFromUserRequest(user.id, task.id);
      dispatch({
        type: PIPELINE_REMOVE_USER_FROM_TASK,
        payload: {
          taskId: task.id,
          userId: user.id,
        },
      });
      onUserDelete(user);
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to remove user", "quicktasker"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wpqt-flex wpqt-w-[320px] wpqt-flex-col">
      <UserAssignementSection
        sectionTitle={__("Assigned users", "quicktasker")}
        users={task.assigned_users}
        onItemSelect={removeUser}
        ActionIcon={MinusIcon}
        actionIconClasses="wpqt-icon-red"
        noUsersText={__("No users assigned", "quicktasker")}
      />
      <UserAssignementSection
        sectionTitle={__("Assign a user", "quicktasker")}
        users={availableUsers}
        onItemSelect={assignUser}
        actionIconClasses="wpqt-icon-green"
        noUsersText={__("No users available to assign", "quicktasker")}
      />
      {loading && (
        <div className="wpqt-flex wpqt-justify-center">
          <LoadingOval width="30" height="30" />
        </div>
      )}
    </div>
  );
}

type UserAssignementSectionProps = {
  sectionTitle: string;
  onItemSelect?: (user: User) => void;
  users: User[];
  ActionIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  actionIconClasses?: string;
  noUsersText: string;
};
function UserAssignementSection({
  sectionTitle,
  onItemSelect = () => {},
  users = [],
  ActionIcon = PlusIcon,
  actionIconClasses,
  noUsersText,
}: UserAssignementSectionProps) {
  return (
    <div className="wpqt-mb-2">
      <div className="wpqt-mb-2 wpqt-text-lg">{sectionTitle}</div>
      {users.map((user: User) => {
        return (
          <div
            key={user.id}
            onClick={(e) => {
              e.stopPropagation();
              onItemSelect(user);
            }}
            className="wpqt-flex wpqt-cursor-pointer wpqt-items-center wpqt-px-2 wpqt-py-1 hover:wpqt-bg-gray-100"
          >
            <div className="wpqt-flex wpqt-flex-col">
              <div>{user.name}</div>
              <div className="wpqt-italic">{user.description}</div>
            </div>
            <ActionIcon
              className={`wpqt-ml-auto wpqt-size-5 ${actionIconClasses}`}
            />
          </div>
        );
      })}
      {users.length === 0 && <div>{noUsersText}</div>}
    </div>
  );
}
export { UserAssignementSelection };
