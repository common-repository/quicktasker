import { Tooltip } from "react-tooltip";

type Props = {
  id: string;
};

function WPQTTooltip({ id }: Props) {
  return (
    <Tooltip id={id} className="wpqt-bg-red-600">
      <span>Tooltip content</span>
    </Tooltip>
  );
}

export { WPQTTooltip };
