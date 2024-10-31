import { useContext, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { toast } from "react-toastify";
import {
  ButtonType,
  WPQTButton,
} from "../../../../components/common/Button/Button";
import { WPQTField } from "../../../../components/common/Form/Field";
import { WPQTFieldSet } from "../../../../components/common/Form/FieldSet";
import {
  InputType,
  WPQTInput,
} from "../../../../components/common/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { logInUserPageRequest } from "../../../api/user-page-api";
import { SET_USER_LOGGED_IN } from "../../../constants";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { useSession } from "../../../hooks/useSession";
import { UserPageAppContext } from "../../../providers/UserPageAppContextProvider";
import { PageScreenMiddle, PageTitle } from "../Page/Page";

function LoginPage() {
  const {
    state: { pageHash, userName },
    userPageAppDispatch,
  } = useContext(UserPageAppContext);
  const { setSessionCookie } = useSession();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password) {
      toast.error(__("Please enter a password", "quicktasker"));
      return;
    }
    try {
      setLoading(true);
      const response = await logInUserPageRequest(pageHash, password);
      await setSessionCookie(response.data);
      userPageAppDispatch({ type: SET_USER_LOGGED_IN, payload: true });
    } catch (error) {
      setLoading(false);
      handleError(error);
    }
  };
  return (
    <PageScreenMiddle>
      <PageTitle
        titleClassName="wpqt-font-normal"
        className="wpqt-mb-2"
        description={__("Please log in to continue", "quicktasker")}
      >
        {sprintf(__("Hello %s", "quicktasker"), userName)}
      </PageTitle>
      <form onSubmit={login}>
        <WPQTFieldSet>
          <WPQTField>
            <WPQTInput
              value={password}
              onChange={setPassword}
              type={InputType.PASSWORD}
            />
          </WPQTField>
          <WPQTField className="wpqt-flex wpqt-justify-center">
            {loading ? (
              <Loading ovalSize="32" />
            ) : (
              <WPQTButton
                btnText={__("Login", "quicktasker")}
                type={ButtonType.SUBMIT}
              />
            )}
          </WPQTField>
        </WPQTFieldSet>
      </form>
      <ForgotPassword />
    </PageScreenMiddle>
  );
}

function ForgotPassword() {
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div
      className="wpqt-flex wpqt-flex-col wpqt-gap3 wpqt-items-center wpqt-mt-2 wpqt-text-sm wpqt-cursor-pointer wpqt-relative wpqt-min-w-[300px] wpqt-text-blue-500"
      onClick={() => setGuideOpen(!guideOpen)}
    >
      <div className="wpqt-mb-2">
        {__("Forgot the password?", "quicktasker")}
      </div>

      <div
        className={`wpqt-text-center wpqt-absolute wpqt-top-full wpqt-left-0 wpqt-w-full ${
          guideOpen ? "wpqt-animate-fadeIn" : "wpqt-animate-fadeOut"
        } ${!guideOpen && "wpqt-hidden"}`}
      >
        {__(
          "Please contact the site admin to reset your password",
          "quicktasker",
        )}
      </div>
    </div>
  );
}

export { LoginPage };
