import Switch from "react-switch";

type Props = {
  checked: boolean;
  handleChange: (checked: boolean) => void;
};
function Toggle({ checked, handleChange }: Props) {
  return (
    <Switch
      onChange={handleChange}
      checked={checked}
      uncheckedIcon={false}
      checkedIcon={false}
      height={20}
      width={44}
    />
  );
}

export { Toggle };
