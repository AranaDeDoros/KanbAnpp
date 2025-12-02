import Select from "react-select";

export default function MembersSingleSelect({
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
      isMulti={false}
      isClearable
      placeholder="Add users..."
      className="text-black"
    />
  );
}
