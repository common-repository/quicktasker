import { useContext } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "../components/ErrorBoundary/ErrorBoundary";
import { AssignableTasksPage } from "./components/Pages/AssignableTasksPage/AssignableTasksPage";
import { ErrorPage } from "./components/Pages/ErrorPage/ErrorPage";
import { HomePage } from "./components/Pages/HomePage/HomePage";
import { LoadingPage } from "./components/Pages/LoadingPage/LoadingPage";
import { LoginPage } from "./components/Pages/LoginPage/LoginPage";
import { NotificationsPage } from "./components/Pages/NotificationsPage/NotificationsPage";
import { PprofilePage } from "./components/Pages/ProfilePage/ProfilePage";
import { SetUpPage } from "./components/Pages/SetUpPage/SetUpPage";
import { TaskCommentsPage } from "./components/Pages/TaskCommentsPage/TaskCommentsPage";
import { TaskPage } from "./components/Pages/TaskPage/TaskPage";
import { UserCommentsPage } from "./components/Pages/UserCommentsPage/UserCommentsPage";
import { UserTasksPage } from "./components/Pages/UserTasksPage/UserTasksPage";
import { useSession } from "./hooks/useSession";
import {
  UserPageAppContext,
  UserPageAppContextProvider,
} from "./providers/UserPageAppContextProvider";
import { UserPageNotificationsContextProvider } from "./providers/UserPageNotificationsContextProvider";

function UserPageContent() {
  const {
    state: { initialLoading, isActiveUser, setupCompleted },
  } = useContext(UserPageAppContext);
  const { isLoggedIn } = useSession();

  if (initialLoading) {
    return <LoadingPage />;
  }
  if (!isActiveUser) {
    return (
      <ErrorPage
        errorTitle={__("User is not active", "quicktasker")}
        errorDescription={__(
          "Your user is not active. Please contact site administrator.",
          "quicktasker",
        )}
      />
    );
  }

  if (!setupCompleted) {
    return <SetUpPage />;
  }

  if (!isLoggedIn()) {
    return <LoginPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/profile" element={<PprofilePage />} />
        <Route path="/user-tasks" element={<UserTasksPage />} />
        <Route path="/assignable-tasks" element={<AssignableTasksPage />} />
        <Route path="/tasks/:taskHash" element={<TaskPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/tasks/:taskHash/comments"
          element={<TaskCommentsPage />}
        />
        <Route path="/user/comments" element={<UserCommentsPage />} />
      </Routes>
    </Router>
  );
}

function UserPageApp() {
  return (
    <ErrorBoundary>
      <UserPageAppContextProvider>
        <UserPageNotificationsContextProvider>
          <UserPageContent />
          <ToastContainer
            closeOnClick={true}
            position="bottom-center"
            toastClassName="wpqt-bottom-[80px] lg:wpqt-bottom-[20px]"
            autoClose={2000}
          />
        </UserPageNotificationsContextProvider>
      </UserPageAppContextProvider>
    </ErrorBoundary>
  );
}

export default UserPageApp;
