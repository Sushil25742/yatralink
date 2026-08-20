"use client"
import React, { useState } from "react";
import { useManagementState, Place } from "@/components/manager/useManagementState";
import { Toolbar, Badge, crowdClass, Drawer } from "@/components/manager/SharedUI";
import { Plus, Edit3, Eye, Trash2, Check } from "lucide-react";

function PlaceEditor({
  place,
  close,
  save,
}: {
  place: Place | null;
  close: () => void;
  save: (p: Record<string, unknown>) => Promise<void>;
}) {
  const [name, setName] = useState(place?.name || "");
  const [category, setCategory] = useState(place?.category || "Heritage");
  const [zone, setZone] = useState(place?.zone || "Patan Core");
  const [capacity, setCapacity] = useState(place?.capacity || 500);

  return (
    <Drawer title={place ? "Edit place" : "Add place"} onClose={close}>
      <div className="mc-form">
        <label>
          Place name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Heritage</option>
            <option>Spiritual</option>
            <option>Market</option>
            <option>Craft</option>
            <option>Park</option>
          </select>
        </label>
        <label>
          Zone
          <input value={zone} onChange={(e) => setZone(e.target.value)} />
        </label>
        <label>
          Capacity
          <input
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
          />
        </label>
        <button
          className="mc-primary"
          disabled={!name.trim()}
          onClick={() => save({ name, category, zone, capacity })}
        >
          <Check />
          Save
        </button>
      </div>
    </Drawer>
  );
}

export default function PlacesPage() {
  const { state, loading, error, act } = useManagementState();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Place | null | undefined>();

  if (loading) return <div style={{padding: '2rem'}}>Loading places...</div>;
  if (error || !state) return <div style={{padding: '2rem'}}>Error loading places</div>;

  const rows = state.places.filter((p) =>
    `${p.name} ${p.zone}`.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <header className="mc-header">
        <h1>Places</h1>
        <p>Manage heritage sites, zones and visitor-facing status.</p>
      </header>
      <div className="mc-scroll">
        <Toolbar q={q} setQ={setQ}>
          <button className="mc-primary" onClick={() => setEditing(null)}>
            <Plus />
            Add place
          </button>
        </Toolbar>
        <div className="mc-table-card">
          <table>
            <thead>
              <tr>
                <th>Place</th>
                <th>Zone</th>
                <th>Crowd</th>
                <th>Capacity</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <small>{p.category}</small>
                  </td>
                  <td>{p.zone}</td>
                  <td>
                    <Badge tone={crowdClass(p.crowd)}>{p.crowd}</Badge>
                  </td>
                  <td>{p.capacity}</td>
                  <td>{p.status}</td>
                  <td>
                    <div className="mc-row-actions">
                      <button onClick={() => setEditing(p)}>
                        <Edit3 />
                      </button>
                      <button
                        onClick={() =>
                          act("place.update", {
                            id: p.id,
                            status: p.status === "Active" ? "Inactive" : "Active",
                          })
                        }
                      >
                        <Eye />
                      </button>
                      <button
                        onClick={() =>
                          confirm(`Delete ${p.name}?`) && act("place.delete", { id: p.id })
                        }
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editing !== undefined && (
          <PlaceEditor
            place={editing}
            close={() => setEditing(undefined)}
            save={async (p) => {
              if (
                await act(
                  editing ? "place.update" : "place.create",
                  editing ? { id: editing!.id, ...p } : p
                )
              )
                setEditing(undefined);
            }}
          />
        )}
      </div>
    </>
  );
}
