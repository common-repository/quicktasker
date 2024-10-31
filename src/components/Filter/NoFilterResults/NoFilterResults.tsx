import { __ } from "@wordpress/i18n";

type Props = {
  text?: string;
};
function NoFilterResults({
  text = __("No results found", "quicktasker"),
}: Props) {
  return <div className="wpqt-font-semibold">{text}</div>;
}

export { NoFilterResults };
