import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export default function ReactSelect({
  catalog,
  value,
  onChange,
  isLoading,
  isMulti,
  placeholder,
  isCreateTable = false,
}) {
  const Component = isCreateTable ? CreatableSelect : Select;
  return (
    <Component
      options={catalog}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
      isMulti={isMulti}
      isClearable
      placeholder={placeholder}
      className="text-black"
    />
  );
}
