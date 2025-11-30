import { useAccounts } from "../api/useAccounts";
import ItemList from "../components/ItemList";
import { useTokenContext } from "../hooks/useTokenContext";

export default function AccountsPage() {
  const {token} = useTokenContext();
  const { data: accounts } = useAccounts(token);
  return (
    <div>
      <ItemList title="Accounts" items={accounts} basePath="accounts" />;
    </div>
  );
}
