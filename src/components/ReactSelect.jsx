import Select from "react-select";

export default function ReactSelect({
  catalog,
  value,
  onChange,
  isLoading,
  isMulti = false,
  placeholder,
}) {

  return (
    <Select
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
