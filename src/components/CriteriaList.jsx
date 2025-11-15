import React, { useState, useEffect } from "react";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/solid";
import { MinusIcon } from "@heroicons/react/24/solid";

export const CriteriaList = ({ onChange }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    onChange?.(items);
  }, [items]);

  const handleCreate = () => {
    setItems([...items, { id: Date.now(), value: "" }]);
  };

  const handleDelete = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleChange = (id, newValue) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <span>Criteria:</span>
          <button onClick={handleCreate}>
            <PlusIcon className="size-4 text-red-500 inline-block mr-1" />
          </button>
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: ".75rem" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <input
                type="text"
                placeholder="test"
                value={item.value}
                onChange={(e) => handleChange(item.id, e.target.value)}
              />

              <button onClick={() => handleDelete(item.id)}>
                <MinusIcon className="size-4 text-red-500 inline-block mr-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
