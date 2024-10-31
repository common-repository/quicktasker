import { PageScreenMiddle } from "../Page/Page";

type Props = {
  errorTitle: string;
  errorDescription?: string;
};

function ErrorPage({ errorTitle, errorDescription }: Props) {
  return (
    <PageScreenMiddle>
      <h2>{errorTitle}</h2>
      {errorDescription && <p>{errorDescription}</p>}
    </PageScreenMiddle>
  );
}

export { ErrorPage };
