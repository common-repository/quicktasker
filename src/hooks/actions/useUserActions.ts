import { __ } from "@wordpress/i18n";
import { toast } from "react-toastify";
import {
  changeUserStatusRequest,
  createUserRequest,
  deleteUserRequest,
  editUserRequest,
  resetUserPasswordRequest,
} from "../../api/api";
import { ServerUser, User } from "../../types/user";

function useUserActions() {
  const createUser = async (
    userName: string,
    userDescription: string,
    callback?: (userData: ServerUser) => void,
  ) => {
    try {
      const response = await createUserRequest(userName, userDescription);
      if (callback) callback(response.data);
      toast.success(__("User created successfully", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(__("User creation failed. Please try again", "quicktasker"));
    }
  };

  const editUser = async (
    user: User,
    callback?: (userData: ServerUser) => void,
  ) => {
    try {
      const response = await editUserRequest(user);
      if (callback) callback(response.data);
      toast.success(__("User edited successfully", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(__("User edit failed. Please try again", "quicktasker"));
    }
  };

  const changeUserStatus = async (
    userId: string,
    status: boolean,
    callback?: (userData: ServerUser) => void,
  ) => {
    try {
      const response = await changeUserStatusRequest(userId, status);
      if (callback) callback(response.data);
      toast.success(__("User status changed successfully", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(
        __("Failed to change user status. Please try again", "quicktasker"),
      );
    }
  };

  const deleteUser = async (
    userId: string,
    callback?: (userId: string) => void,
  ) => {
    try {
      await deleteUserRequest(userId);
      if (callback) callback(userId);
      toast.success(__("User deleted successfully", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(__("Failed to delete user. Please try again", "quicktasker"));
    }
  };

  const resetUserPassword = async (
    userId: string,
    callback?: (userId: string) => void,
  ) => {
    try {
      await resetUserPasswordRequest(userId);
      if (callback) callback(userId);
      toast.success(__("User password reset successfully", "quicktasker"));
    } catch (error) {
      console.error(error);
      toast.error(
        __("Failed to reset user password. Please try again", "quicktasker"),
      );
    }
  };

  return {
    createUser,
    editUser,
    changeUserStatus,
    deleteUser,
    resetUserPassword,
  };
}

export { useUserActions };
