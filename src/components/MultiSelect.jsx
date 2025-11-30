import Select from "react-select";

export default function MembersMultiSelect({
  users,
  value,
  onChange,
  isLoading,
}) {
  const options =
    users?.map((user) => ({
      value: user.id,
      label: user.username,
    })) || [];

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      isLoading={isLoading}
      isMulti
      placeholder="Add users..."
      className="text-black"
    />
  );
}
