import React, { useState } from "react";
import { Drawer } from "./SharedUI";
import { Experience, Operator } from "./useManagementState";
import { Check } from "lucide-react";

export function ExperienceEditor({
  item,
  operators,
  operatorMode,
  close,
  save,
}: {
  item: Experience | null;
  operators: Operator[];
  operatorMode: boolean;
  close: () => void;
  save: (p: Record<string, unknown>) => Promise<void>;
}) {
  const [title, setTitle] = useState(item?.title || "");
  const [category, setCategory] = useState(item?.category || "Culture");
  const [price, setPrice] = useState(item?.price || 800);
  const [capacity, setCapacity] = useState(item?.capacity || 8);
  const [operatorId, setOperatorId] = useState(
    item?.operatorId || operators[0]?.id || ""
  );

  return (
    <Drawer title={item ? "Edit experience" : "Add experience"} onClose={close}>
      <div className="mc-form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Craft</option>
            <option>Food</option>
            <option>Culture</option>
            <option>Art</option>
            <option>Spiritual</option>
          </select>
        </label>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </label>
        <label>
          Capacity
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </label>
        {!operatorMode && !item && (
          <label>
            Operator
            <select
              value={operatorId}
              onChange={(e) => setOperatorId(e.target.value)}
            >
              {operators.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.business}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          className="mc-primary"
          disabled={!title.trim()}
          onClick={() => save({ title, category, price, capacity, operatorId })}
        >
          <Check />
          Save experience
        </button>
      </div>
    </Drawer>
  );
}
