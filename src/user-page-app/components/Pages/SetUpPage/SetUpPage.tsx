import { useContext, useEffect, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import {
  ButtonType,
  WPQTButton,
} from "../../../../components/common/Button/Button";
import { WPQTField } from "../../../../components/common/Form/Field";
import { WPQTFieldSet } from "../../../../components/common/Form/FieldSet";
import { WPQTLabel } from "../../../../components/common/Form/Label";
import {
  InputType,
  WPQTInput,
} from "../../../../components/common/Input/Input";
import { Loading } from "../../../../components/Loading/Loading";
import { setUpUserPageRequest } from "../../../api/user-page-api";
import { useErrorHandler } from "../../../hooks/useErrorHandler";
import { UserPageAppContext } from "../../../providers/UserPageAppContextProvider";
import { PageScreenMiddle, PageTitle } from "../Page/Page";

function SetUpPage() {
  const {
    state: { pageHash, userName },
  } = useContext(UserPageAppContext);
  const { handleError } = useErrorHandler();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (password !== passwordRepeat) {
      setValidationError(__("Passwords do not match", "quicktasker"));
    } else {
      setValidationError("");
    }
  }, [password, passwordRepeat]);

  const submitSetup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !passwordRepeat) {
      setValidationError(__("Please enter a password", "quicktasker"));
      return;
    }
    if (validationError) {
      return;
    }
    const data = { password };

    try {
      setLoading(true);
      await setUpUserPageRequest(pageHash, data);
      window.location.reload();
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  return (
    <PageScreenMiddle>
      <PageTitle
        titleClassName="wpqt-font-normal"
        description={__("Please complete the setup", "quicktasker")}
      >
        {sprintf(__("Hello %s", "quicktasker"), userName)}
      </PageTitle>
      <form onSubmit={submitSetup}>
        <WPQTFieldSet>
          <WPQTField>
            <WPQTLabel className="wpqt-text-center">
              {__("Enter your new password", "quicktasker")}
            </WPQTLabel>
            <WPQTInput
              value={password}
              onChange={setPassword}
              type={InputType.PASSWORD}
            />
          </WPQTField>
          <WPQTField>
            <WPQTLabel className="wpqt-text-center">
              {__("Repeat your new password", "quicktasker")}
            </WPQTLabel>
            <WPQTInput
              value={passwordRepeat}
              onChange={setPasswordRepeat}
              type={InputType.PASSWORD}
            />
          </WPQTField>
          {validationError && (
            <div className="wpqt-text-qtTextRed wpqt-mb-3">
              {validationError}
            </div>
          )}
          <WPQTField className="wpqt-text-center">
            {loading ? (
              <Loading ovalSize="32" />
            ) : (
              <WPQTButton
                btnText={__("Setup", "quicktasker")}
                type={ButtonType.SUBMIT}
              />
            )}
          </WPQTField>
        </WPQTFieldSet>
      </form>
    </PageScreenMiddle>
  );
}

export { SetUpPage };
