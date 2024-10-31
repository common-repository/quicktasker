import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import { useCurrentPage } from "./hooks/useCurrentPage";
import { AppContextProvider } from "./providers/AppContextProvider";
import { LoadingContextProvider } from "./providers/LoadingContextProvider";
import { ModalContextProvider } from "./providers/ModalContextProvider";
import { PipelinesContextProvider } from "./providers/PipelinesContextProvider";
import { UserContextProvider } from "./providers/UserContextProvider";

function App() {
  const currentPage = useCurrentPage();

  return (
    <ErrorBoundary>
      <AppContextProvider>
        <UserContextProvider>
          <ModalContextProvider>
            <PipelinesContextProvider>
              <LoadingContextProvider>
                {currentPage}
                <ToastContainer position="bottom-right" />
              </LoadingContextProvider>
            </PipelinesContextProvider>
          </ModalContextProvider>
        </UserContextProvider>
      </AppContextProvider>
    </ErrorBoundary>
  );
}

export default App;
